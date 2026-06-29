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

// 世爻位置 (1-based 卦序 → 0-based 爻位)
const SHI_POSITIONS = [
  5, 1, 4, 3, 4, 3, 1, 5, // 1-8
  4, 3, 4, 3, 1, 5, 1, 5, // 9-16
  2, 4, 0, 4, 1, 5, 1, 5, // 17-24
  3, 2, 4, 3, 1, 5, 0, 4, // 25-32
  0, 3, 1, 5, 0, 0, 1, 5, // 33-40
  2, 0, 2, 1, 4, 3, 1, 5, // 41-48
  2, 1, 0, 3, 1, 5, 1, 5, // 49-56
  2, 1, 0, 0, 2, 0, 4, 3, // 57-64
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
  const MAP = [7, 6, 5, 4, 3, 2, 1, 0]
  return MAP[code]
}
