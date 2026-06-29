import { ref, computed, watch } from 'vue'

/**
 * 公历 ↔ 干支历转换 composable
 *
 * 参考算法:
 *   年干支: (year - 4) % 60 → 六十甲子索引
 *   月干支: 年干决定月干起点 → (年干×2 + 月份) mod 10 得天干, 月份固定配地支
 *   日干支: 以 1900-01-01 = 甲戌日 为基准计算累积天数
 *   时干支: 日干×2 + 时辰序 mod 10 得天干, 时辰固定配地支
 */

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const SIXTY_CYCLE = [] // 六十甲子表

for (let i = 0; i < 60; i++) {
  SIXTY_CYCLE.push(HEAVENLY_STEMS[i % 10] + EARTHLY_BRANCHES[i % 12])
}

// 时辰对应的时间范围
const SHI_CHEN_RANGES = [
  { name: '子时', branch: 0, start: [23, 0], end: [0, 59] },
  { name: '丑时', branch: 1, start: [1, 0], end: [2, 59] },
  { name: '寅时', branch: 2, start: [3, 0], end: [4, 59] },
  { name: '卯时', branch: 3, start: [5, 0], end: [6, 59] },
  { name: '辰时', branch: 4, start: [7, 0], end: [8, 59] },
  { name: '巳时', branch: 5, start: [9, 0], end: [10, 59] },
  { name: '午时', branch: 6, start: [11, 0], end: [12, 59] },
  { name: '未时', branch: 7, start: [13, 0], end: [14, 59] },
  { name: '申时', branch: 8, start: [15, 0], end: [16, 59] },
  { name: '酉时', branch: 9, start: [17, 0], end: [18, 59] },
  { name: '戌时', branch: 10, start: [19, 0], end: [20, 59] },
  { name: '亥时', branch: 11, start: [21, 0], end: [22, 59] },
]

// 基准日: 1900-01-01 = 甲戌日 (六十甲子索引 10)
const BASE_DATE = new Date(1900, 0, 1)
const BASE_DAY_GZ = 10

// 月地支映射: 正月寅(2), 二月卯(3), ... 十二月丑(0)
const MONTH_BRANCH = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0] // index by Gregorian month (Jan=0)
// 月天干: (年天干索引 × 2 + 月份) % 10

export function useCalendar() {
  // --- 公历字段 ---
  const gregorianYear = ref(new Date().getFullYear())
  const gregorianMonth = ref(new Date().getMonth() + 1) // 1-12
  const gregorianDay = ref(new Date().getDate())
  const gregorianHour = ref(new Date().getHours())
  const gregorianMinute = ref(0)

  // --- 干支字段 ---
  const gzYear = ref('甲子')
  const gzMonth = ref('甲子')
  const gzDay = ref('甲子')
  const gzHour = ref('甲子')
  const shiChenName = ref('子时')

  // --- 内部同步标志 ---
  let syncing = false // 防止循环更新

  // --- 计算 ---

  /**
   * 公历 → 干支历
   *
   * 月建近似算法（精确排卦需查节气，此处取公历月近似）:
   *   正月≈寅(Feb→地支2), 二月≈卯(Mar→3), ..., 十二月≈丑(Jan→1)
   *   月 branch = m % 12  (Jan=1→丑, Feb=2→寅, ..., Dec=12→子)
   *   月 stem = (年干×2 + 正月起数) % 10
   *   甲己之年丙作首 → yearStemIndex 0,5 → 正月 stem=2(丙)
   *   公式: (yearStemIndex × 2 + m - 2) % 10
   */
  function gregorianToGanZhi(y, m, d, hh, mm) {
    // 年干支
    const yearGZIdx = ((y - 4) % 60 + 60) % 60
    const yearGZ = SIXTY_CYCLE[yearGZIdx]
    const yearStemIdx = yearGZIdx % 10

    // 月干支: branch = m % 12, stem = (yearStem * 2 + m - 2 + 10) % 10
    const mBranch = m % 12
    const mStem = (yearStemIdx * 2 + m - 2 + 10) % 10
    const monthGZ = HEAVENLY_STEMS[mStem] + EARTHLY_BRANCHES[mBranch]

    // 日干支: 以 1900-01-01 = 甲戌日(索引10) 为基准
    const targetDate = new Date(y, m - 1, d)
    const diffDays = Math.floor((targetDate - BASE_DATE) / (1000 * 60 * 60 * 24))
    const dayGZIdx = ((BASE_DAY_GZ + diffDays) % 60 + 60) % 60
    const dayGZ = SIXTY_CYCLE[dayGZIdx]
    const dayStemIdx = dayGZIdx % 10

    // 时干支: 日干决定时干起点, 时辰决定地支
    const shiChen = getShiChen(hh, mm)
    const hourBranchIdx = shiChen.index
    const hourStemIdx = (dayStemIdx * 2 + hourBranchIdx) % 10
    const hourGZ = HEAVENLY_STEMS[hourStemIdx] + EARTHLY_BRANCHES[hourBranchIdx]

    return {
      year: yearGZ,
      month: monthGZ,
      day: dayGZ,
      hour: hourGZ,
      shiChen: shiChen.fullName,
    }
  }

  /** 根据小时+分钟获取时辰 */
  function getShiChen(hh, mm) {
    for (const sc of SHI_CHEN_RANGES) {
      const [sh, sm] = sc.start
      const [eh, em] = sc.end
      if (sh === 23) {
        // 子时跨日: 23:00-00:59
        if ((hh >= 23 && mm >= 0) || (hh === 0 && mm <= 59)) {
          return { index: 0, name: '子', fullName: '子时', range: '23:00 - 00:59' }
        }
      } else if (hh >= sh && hh <= eh) {
        if (hh === eh && mm > em) continue
        return {
          index: sc.branch,
          name: EARTHLY_BRANCHES[sc.branch],
          fullName: sc.name,
          range: `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')} - ${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
        }
      }
    }
    return { index: 0, name: '子', fullName: '子时', range: '23:00 - 00:59' }
  }

  /** 同步公历 → 干支 */
  function syncGregorianToGZ() {
    if (syncing) return
    syncing = true
    const gz = gregorianToGanZhi(
      gregorianYear.value,
      gregorianMonth.value,
      gregorianDay.value,
      gregorianHour.value,
      gregorianMinute.value
    )
    gzYear.value = gz.year
    gzMonth.value = gz.month
    gzDay.value = gz.day
    gzHour.value = gz.hour
    shiChenName.value = gz.shiChen
    syncing = false
  }

  /** 获取计算结果（用于排卦） */
  const calendarResult = computed(() => {
    const shiChen = getShiChen(gregorianHour.value, gregorianMinute.value)
    return {
      gregorian: {
        year: gregorianYear.value,
        month: gregorianMonth.value,
        day: gregorianDay.value,
        hour: gregorianHour.value,
        minute: gregorianMinute.value,
      },
      ganzhi: {
        year: gzYear.value,
        month: gzMonth.value,
        day: gzDay.value,
        hour: gzHour.value,
      },
      shiChen: shiChen,
      /** 月建地支索引 (寅=0, 卯=1, ...) */
      monthBranchIndex: (gregorianMonth.value + 1) % 12,
    }
  })

  /** 用当前时间初始化 */
  function initWithNow() {
    const now = new Date()
    gregorianYear.value = now.getFullYear()
    gregorianMonth.value = now.getMonth() + 1
    gregorianDay.value = now.getDate()
    gregorianHour.value = now.getHours()
    gregorianMinute.value = now.getMinutes()
    syncGregorianToGZ()
  }

  // 监听公历变化，自动同步干支
  watch([gregorianYear, gregorianMonth, gregorianDay, gregorianHour, gregorianMinute], () => {
    syncGregorianToGZ()
  })

  // 初始化
  syncGregorianToGZ()

  return {
    // 公历
    gregorianYear,
    gregorianMonth,
    gregorianDay,
    gregorianHour,
    gregorianMinute,
    // 干支
    gzYear,
    gzMonth,
    gzDay,
    gzHour,
    shiChenName,
    // 工具
    calendarResult,
    initWithNow,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    SIXTY_CYCLE,
    SHI_CHEN_RANGES,
    getShiChen,
  }
}
