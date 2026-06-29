import { ref, computed, reactive } from 'vue'
import {
  getHexagram,
  getNajiaData,
  getSixKinName,
  getSixBeasts,
  getPalaceElement,
  getPalaceTrigramName,
} from '../data/hexagrams.js'

/**
 * 六爻排卦 composable (手动选爻 + 纳甲六亲六兽)
 */
export const YAO_OPTIONS = [
  { value: 9, label: '老阳', symbol: '⚊', isYang: true, isChanging: true, desc: '9 · 阳动变阴' },
  { value: 8, label: '少阴', symbol: '⚋', isYang: false, isChanging: false, desc: '8 · 阴静不变' },
  { value: 7, label: '少阳', symbol: '⚊', isYang: true, isChanging: false, desc: '7 · 阳静不变' },
  { value: 6, label: '老阴', symbol: '⚋', isYang: false, isChanging: true, desc: '6 · 阴动变阳' },
]

export const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']

// 世爻位置 (0-based 卦序 → 0-based 爻位: 0初爻...5上爻)
// 八宫每宫8卦: 本宫5, 一世0, 二世1, 三世2, 四世3, 五世4, 游魂3, 归魂2
const SHI_POSITIONS = [
  5, 4, 2, 3, 0, 3, 1, 2, // 0-7   天/履/同人/无妄/姤/讼/遁/否
  4, 5, 3, 2, 3, 0, 2, 1, // 8-15  夬/兑/革/随/大过/困/咸/萃
  2, 3, 5, 4, 1, 2, 0, 3, // 16-23 大有/睽/离/噬嗑/鼎/未济/旅/晋
  2, 2, 4, 5, 2, 1, 3, 0, // 24-31 大壮/归妹/丰/震/恒/解/小过/豫
  0, 3, 1, 2, 5, 4, 2, 3, // 32-39 小畜/中孚/家人/益/巽/涣/渐/观
  3, 0, 2, 1, 4, 5, 3, 2, // 40-47 需/节/既济/屯/井/坎/蹇/比
  1, 2, 0, 3, 2, 3, 5, 4, // 48-55 大畜/损/贲/颐/蛊/蒙/艮/剥
  2, 1, 3, 0, 3, 2, 4, 5, // 56-63 泰/临/明夷/复/升/师/谦/坤
]

export function useLiuYao() {
  const lines = reactive([
    { value: null }, { value: null }, { value: null },
    { value: null }, { value: null }, { value: null },
  ])

  // 时间/日历数据 (由 App.vue 排卦时传入)
  const calendarData = ref(null)

  const isComplete = computed(() => lines.every(l => l.value !== null))

  const resolvedLines = computed(() =>
    lines.map((l, i) => {
      if (l.value === null) return null
      const opt = YAO_OPTIONS.find(o => o.value === l.value)
      return { ...opt, position: i }
    })
  )

  const changingLines = computed(() =>
    resolvedLines.value.filter(l => l && l.isChanging)
  )

  const hasChanging = computed(() => changingLines.value.length > 0)

  /** 本卦 */
  const primaryHexagram = computed(() => {
    if (!isComplete.value) return null
    const res = resolvedLines.value
    const lower = trigramFromResolved(res.slice(0, 3))
    const upper = trigramFromResolved(res.slice(3, 6))
    return getHexagram(upper, lower)
  })

  /** 变卦 */
  const changedHexagram = computed(() => {
    if (!isComplete.value) return null
    const res = resolvedLines.value
    const flipped = res.map(l => ({
      ...l, isYang: l.isChanging ? !l.isYang : l.isYang,
    }))
    const lower = trigramFromResolved(flipped.slice(0, 3))
    const upper = trigramFromResolved(flipped.slice(3, 6))
    return getHexagram(upper, lower)
  })

  /** 互卦 */
  const mutualHexagram = computed(() => {
    if (!isComplete.value) return null
    const res = resolvedLines.value
    const lower = trigramFromResolved(res.slice(1, 4))
    const upper = trigramFromResolved(res.slice(2, 5))
    return getHexagram(upper, lower)
  })

  /** 世应 */
  const shiYing = computed(() => {
    if (!primaryHexagram.value) return null
    const shiPos = SHI_POSITIONS[primaryHexagram.value.index - 1]
    const yingPos = (shiPos + 3) % 6
    return { shi: shiPos, ying: yingPos }
  })

  // ========= 纳甲·六亲·六兽 =========

  /** 本卦每爻的纳甲数据 (地支、天干、五行) */
  const najiaData = computed(() => {
    if (!primaryHexagram.value) return null
    return getNajiaData(
      primaryHexagram.value.lowerTrigram,
      primaryHexagram.value.upperTrigram
    )
  })

  /** 变卦每爻的纳甲数据 */
  const changedNajiaData = computed(() => {
    if (!changedHexagram.value) return null
    return getNajiaData(
      changedHexagram.value.lowerTrigram,
      changedHexagram.value.upperTrigram
    )
  })

  /** 卦宫五行索引 */
  const palaceElementIdx = computed(() => {
    if (!primaryHexagram.value) return null
    return getPalaceElement(primaryHexagram.value.index)
  })

  /** 卦宫名 */
  const palaceName = computed(() => {
    if (!primaryHexagram.value) return ''
    return getPalaceTrigramName(primaryHexagram.value.index) + '宫'
  })

  /** 六亲 (本卦) */
  const sixKins = computed(() => {
    if (!najiaData.value || palaceElementIdx.value === null) return null
    return najiaData.value.map(na =>
      getSixKinName(palaceElementIdx.value, na.elementIdx)
    )
  })

  /** 六兽 (基于日干) */
  const sixBeasts = computed(() => {
    if (!calendarData.value) return Array(6).fill('')
    const dayGz = calendarData.value.ganzhi.day
    // 日干是干支的第一个字
    const dayStem = dayGz.charAt(0)
    const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    const stemIdx = HEAVENLY_STEMS.indexOf(dayStem)
    return getSixBeasts(stemIdx >= 0 ? stemIdx : 0)
  })

  /** 变卦六亲 */
  const changedSixKins = computed(() => {
    if (!changedNajiaData.value || palaceElementIdx.value === null) return null
    return changedNajiaData.value.map(na =>
      getSixKinName(palaceElementIdx.value, na.elementIdx)
    )
  })

  // ========= 方法 =========

  function setLine(index, value) {
    lines[index].value = value
  }

  function setCalendar(data) {
    calendarData.value = data
  }

  function reset() {
    lines.forEach(l => (l.value = null))
    calendarData.value = null
  }

  return {
    lines, isComplete, resolvedLines, changingLines, hasChanging,
    primaryHexagram, changedHexagram, mutualHexagram, shiYing,
    // 纳甲
    najiaData, changedNajiaData,
    palaceElementIdx, palaceName,
    sixKins, changedSixKins, sixBeasts,
    calendarData,
    setLine, setCalendar, reset,
  }
}

function trigramFromResolved(three) {
  const bits = three.map(l => (l.isYang ? 1 : 0))
  const code = bits[0] * 1 + bits[1] * 2 + bits[2] * 4
  // code→八卦: 0坤 1震 2坎 3兑 4艮 5离 6巽 7乾
  const MAP = [7, 3, 5, 1, 6, 2, 4, 0]
  return MAP[code]
}
