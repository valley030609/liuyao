/**
 * 六十四卦完整数据
 *
 * 八卦索引:
 *   0=乾☰  1=兑☱  2=离☲  3=震☳
 *   4=巽☴  5=坎☵  6=艮☶  7=坤☷
 *
 * 六十四卦索引 = 上卦*8 + 下卦 (0-based)
 */

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const TRIGRAM_NAMES = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
const TRIGRAM_SYMBOLS = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷']
const TRIGRAM_MEANINGS = ['天', '泽', '火', '雷', '风', '水', '山', '地']

export const ELEMENTS = ['金', '水', '木', '火', '土']

/** 八卦五行: 乾兑金, 离火, 震巽木, 坎水, 艮坤土 */
const TRIGRAM_ELEMENT = [0, 0, 3, 2, 2, 1, 4, 4]

/**
 * 六十四卦表: [name, upperTrigram, lowerTrigram, description]
 * 卦名格式: 上卦象+下卦象+卦名 (如 天泽履 = 乾上兑下)
 * 索引 = upper * 8 + lower
 */
const HEXAGRAM_TABLE = [
  // 0-7: 上卦乾☰ (天)
  ['乾为天', 0, 0, '元亨利贞，自强不息'],
  ['天泽履', 0, 1, '如履薄冰，辨上下定民志'],
  ['天火同人', 0, 2, '大同于人，类族辨物'],
  ['天雷无妄', 0, 3, '真实无妄，茂对时育万物'],
  ['天风姤', 0, 4, '不期而遇，施命诰四方'],
  ['天水讼', 0, 5, '争讼辨明，作事谋始'],
  ['天山遁', 0, 6, '退避隐遁，远小人不恶而严'],
  ['天地否', 0, 7, '天地闭塞，俭德辟难'],

  // 8-15: 上卦兑☱ (泽)
  ['泽天夬', 1, 0, '决断果行，去除小人'],
  ['兑为泽', 1, 1, '喜悦和乐，朋友讲习'],
  ['泽火革', 1, 2, '变革更新，治历明时'],
  ['泽雷随', 1, 3, '随从顺时，向晦入宴息'],
  ['泽风大过', 1, 4, '大过寻常，独立不惧遁世无闷'],
  ['泽水困', 1, 5, '困厄艰难，致命遂志'],
  ['泽山咸', 1, 6, '感应相与，虚受人'],
  ['泽地萃', 1, 7, '聚集荟萃，除戎器戒不虞'],

  // 16-23: 上卦离☲ (火)
  ['火天大有', 2, 0, '丰收富有，遏恶扬善'],
  ['火泽睽', 2, 1, '乖离违逆，以同而异'],
  ['离为火', 2, 2, '光明依附，照临四方'],
  ['火雷噬嗑', 2, 3, '决断刑狱，明罚敕法'],
  ['火风鼎', 2, 4, '鼎立更新，正位凝命'],
  ['火水未济', 2, 5, '事未成就，慎辨物居方'],
  ['火山旅', 2, 6, '旅行在外，明慎用刑不留狱'],
  ['火地晋', 2, 7, '前进光明，自昭明德'],

  // 24-31: 上卦震☳ (雷)
  ['雷天大壮', 3, 0, '强盛壮大，非礼勿行'],
  ['雷泽归妹', 3, 1, '婚嫁归宿，永终知敝'],
  ['雷火丰', 3, 2, '丰大盛明，折狱致刑'],
  ['震为雷', 3, 3, '震动警醒，恐惧修省'],
  ['雷风恒', 3, 4, '恒久不变，立不易方'],
  ['雷水解', 3, 5, '解除困难，赦过宥罪'],
  ['雷山小过', 3, 6, '小有过越，行过乎恭丧过乎哀'],
  ['雷地豫', 3, 7, '愉悦安乐，作乐崇德'],

  // 32-39: 上卦巽☴ (风)
  ['风天小畜', 4, 0, '小有蓄积，以懿文德'],
  ['风泽中孚', 4, 1, '诚信中正，议狱缓死'],
  ['风火家人', 4, 2, '治家有道，言有物行有恒'],
  ['风雷益', 4, 3, '增益利民，见善则迁有过则改'],
  ['巽为风', 4, 4, '柔顺入微，申命行事'],
  ['风水涣', 4, 5, '涣散聚合，享帝立庙'],
  ['风山渐', 4, 6, '渐进有序，居贤德善俗'],
  ['风地观', 4, 7, '观察省视，省方观民设教'],

  // 40-47: 上卦坎☵ (水)
  ['水天需', 5, 0, '等待时机，饮食宴乐'],
  ['水泽节', 5, 1, '节制有度，制数度议德行'],
  ['水火既济', 5, 2, '事已成就，思患豫防'],
  ['水雷屯', 5, 3, '初生艰难，经纶天下'],
  ['水风井', 5, 4, '井养不穷，劳民劝相'],
  ['坎为水', 5, 5, '重重险阻，常德行习教事'],
  ['水山蹇', 5, 6, '艰难跋涉，反身修德'],
  ['水地比', 5, 7, '亲比依附，建万国亲诸侯'],

  // 48-55: 上卦艮☶ (山)
  ['山天大畜', 6, 0, '大蓄积力，多识前言'],
  ['山泽损', 6, 1, '损下益上，惩忿窒欲'],
  ['山火贲', 6, 2, '文饰之美，明庶政无敢折狱'],
  ['山雷颐', 6, 3, '颐养身心，慎言语节饮食'],
  ['山风蛊', 6, 4, '整治弊病，振民育德'],
  ['山水蒙', 6, 5, '启蒙开智，果行育德'],
  ['艮为山', 6, 6, '止其所止，思不出其位'],
  ['山地剥', 6, 7, '剥落衰败，厚下安宅'],

  // 56-63: 上卦坤☷ (地)
  ['地天泰', 7, 0, '天地交泰，辅相天地'],
  ['地泽临', 7, 1, '临下亲民，教思无穷'],
  ['地火明夷', 7, 2, '光明受伤，莅众用晦而明'],
  ['地雷复', 7, 3, '一阳来复，闭关休养'],
  ['地风升', 7, 4, '上升渐进，积小以高大'],
  ['地水师', 7, 5, '出师用兵，容民畜众'],
  ['地山谦', 7, 6, '谦虚卑下，裒多益寡称物平施'],
  ['坤为地', 7, 7, '柔顺厚德，厚德载物'],
]

/**
 * 根据上下卦索引获取六十四卦信息
 * @param {number} upper - 上卦索引 (0-7)
 * @param {number} lower - 下卦索引 (0-7)
 * @returns {object}
 */
export function getHexagram(upper, lower) {
  const idx = upper * 8 + lower
  const [name, up, lo, desc] = HEXAGRAM_TABLE[idx]
  return {
    index: idx + 1,
    name,
    upperTrigram: up,
    lowerTrigram: lo,
    upperTrigramName: TRIGRAM_NAMES[up],
    lowerTrigramName: TRIGRAM_NAMES[lo],
    upperSymbol: TRIGRAM_SYMBOLS[up],
    lowerSymbol: TRIGRAM_SYMBOLS[lo],
    upperMeaning: TRIGRAM_MEANINGS[up],
    lowerMeaning: TRIGRAM_MEANINGS[lo],
    description: desc,
    element: TRIGRAM_ELEMENT[up] !== undefined ? ELEMENTS[TRIGRAM_ELEMENT[up]] : '?',
    fullName: `${TRIGRAM_NAMES[up]}上${TRIGRAM_NAMES[lo]}下·${name}`,
  }
}

// ============================================================
//  纳甲体系 (Najia System)
// ============================================================

/** 地支五行: 0=土 1=水 2=木 3=木 4=土 5=火 6=火 7=土 8=金 9=金 10=土 11=水 */
const BRANCH_ELEMENT = [4, 1, 2, 2, 4, 3, 3, 4, 0, 0, 4, 1]
export const BRANCH_ELEMENT_NAME = ['金', '水', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水']

/**
 * 八宫纳甲地支表
 * 索引=八卦(0乾1兑2离3震4巽5坎6艮7坤)
 * 值=[初爻地支, 二爻, 三爻, 四爻, 五爻, 上爻] (0=子...11=亥)
 */
const NAJIA_BRANCHES = [
  [0, 2, 4, 6, 8, 10],  // 乾☰: 子寅辰午申戌
  [5, 3, 1, 11, 9, 7],  // 兑☱: 巳卯丑亥酉未
  [3, 1, 11, 9, 7, 5],  // 离☲: 卯丑亥酉未巳
  [0, 2, 4, 6, 8, 10],  // 震☳: 子寅辰午申戌 (同乾)
  [1, 11, 9, 7, 5, 3],  // 巽☴: 丑亥酉未巳卯
  [2, 4, 6, 8, 10, 0],  // 坎☵: 寅辰午申戌子
  [4, 6, 8, 10, 0, 2],  // 艮☶: 辰午申戌子寅
  [7, 5, 3, 9, 11, 1],  // 坤☷: 未巳卯酉亥丑
]

/** 八宫纳天干: inner=内卦天干索引, outer=外卦天干索引 */
const NAJIA_STEMS = [
  { inner: 0, outer: 8 },  // 乾: 内甲外壬
  { inner: 3, outer: 3 },  // 兑: 丁
  { inner: 5, outer: 5 },  // 离: 己
  { inner: 6, outer: 6 },  // 震: 庚
  { inner: 7, outer: 7 },  // 巽: 辛
  { inner: 4, outer: 4 },  // 坎: 戊
  { inner: 2, outer: 2 },  // 艮: 丙
  { inner: 1, outer: 9 },  // 坤: 内乙外癸
]

/**
 * 六十四卦卦宫归属 (0-based 卦序 → 卦宫 0乾1兑2离3震4巽5坎6艮7坤)
 * 八宫: 本宫→一世→二世→三世→四世→五世→游魂→归魂
 */
const HEXAGRAM_PALACE = [
  0, 6, 2, 4, 0, 2, 0, 0, // 0-7   乾/履/同人/无妄/姤/讼/遁/否
  7, 1, 5, 3, 3, 1, 1, 1, // 8-15  夬/兑/革/随/大过/困/咸/萃
  0, 6, 2, 4, 2, 2, 2, 0, // 16-23 大有/睽/离/噬嗑/鼎/未济/旅/晋
  7, 1, 5, 3, 3, 3, 1, 3, // 24-31 大壮/归妹/丰/震/恒/解/小过/豫
  4, 6, 4, 4, 4, 2, 6, 0, // 32-39 小畜/中孚/家人/益/巽/涣/渐/观
  7, 5, 5, 5, 3, 5, 1, 7, // 40-47 需/节/既济/屯/井/坎/蹇/比
  6, 6, 6, 4, 4, 2, 6, 0, // 48-55 大畜/损/贲/颐/蛊/蒙/艮/剥
  7, 7, 5, 7, 3, 5, 1, 7, // 56-63 泰/临/明夷/复/升/师/谦/坤
]

/** 地支配五行名称 */
export function getBranchElement(idx) {
  return BRANCH_ELEMENT_NAME[idx]
}

/** 天干五行: 甲乙木 丙丁火 戊己土 庚辛金 壬癸水 */
export function getStemElement(idx) {
  return ELEMENTS[Math.floor(idx / 2) % 5]
}

/**
 * 获取本卦六爻纳甲数据
 * @param {number} hexIdx - 六十四卦序号 (1-based)
 * @param {number} lowerTrigram - 下卦索引 (0-7)
 * @param {number} upperTrigram - 上卦索引 (0-7)
 * @returns {Array} 6个元素, 每个 {stem, branch, stemName, branchName, element, fullName}
 */
export function getNajiaData(lowerTrigram, upperTrigram) {
  const lowerBranches = NAJIA_BRANCHES[lowerTrigram]
  const upperBranches = NAJIA_BRANCHES[upperTrigram]
  const allBranches = [...lowerBranches.slice(0, 3), ...upperBranches.slice(3, 6)]

  const lowerStemInfo = NAJIA_STEMS[lowerTrigram]
  const upperStemInfo = NAJIA_STEMS[upperTrigram]

  return allBranches.map((branchIdx, i) => {
    const stemIdx = i < 3 ? lowerStemInfo.inner : upperStemInfo.outer
    return {
      stemIdx,
      branchIdx,
      stemName: HEAVENLY_STEMS[stemIdx],
      branchName: EARTHLY_BRANCHES[branchIdx],
      element: BRANCH_ELEMENT_NAME[branchIdx],
      elementIdx: BRANCH_ELEMENT[branchIdx],
      fullName: `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`,
      stemElement: Math.floor(stemIdx / 2) % 5,
    }
  })
}

/**
 * 六亲: 以卦宫五行为"我"
 *   生我→父母  我生→子孙  克我→官鬼  我克→妻财  同我→兄弟
 */
const SIX_KIN_NAMES = ['父母', '子孙', '妻财', '官鬼', '兄弟']

/**
 * 六亲计算: 以卦宫五行为"我", 与爻的地支五行比较
 * 五行: 0金 1水 2木 3火 4土
 * 相生: 金→水→木→火→土→金  (X 生 (X+1)%5)
 * 相克: 金克木, 水克火, 木克土, 火克金, 土克水  (X 克 (X+2)%5)
 */
export function getSixKin(palaceElementIdx, yaoElementIdx) {
  const palaceEl = palaceElementIdx
  const yaoEl = yaoElementIdx
  if (yaoEl === palaceEl) return 4               // 同我→兄弟
  if (yaoEl === (palaceEl + 4) % 5) return 0     // 生我→父母
  if (yaoEl === (palaceEl + 1) % 5) return 1     // 我生→子孙
  if (yaoEl === (palaceEl + 2) % 5) return 2     // 我克→妻财
  if (yaoEl === (palaceEl + 3) % 5) return 3     // 克我→官鬼
  return 4
}

export function getSixKinName(palaceElementIdx, yaoElementIdx) {
  return SIX_KIN_NAMES[getSixKin(palaceElementIdx, yaoElementIdx)]
}

/**
 * 六兽 (六神): 青龙 朱雀 勾陈 螣蛇 白虎 玄武
 * 根据日干排初爻, 依次上排
 */
const SIX_BEASTS = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武']

export function getSixBeasts(dayStemIdx) {
  // 甲乙(0,1)→青龙  丙丁(2,3)→朱雀  戊(4)→勾陈  己(5)→螣蛇  庚辛(6,7)→白虎  壬癸(8,9)→玄武
  const baseMap = [0, 0, 1, 1, 2, 3, 4, 4, 5, 5]
  const baseIdx = baseMap[dayStemIdx]
  // 从初爻到上爻 (0→5)
  return Array.from({ length: 6 }, (_, i) => SIX_BEASTS[(baseIdx + i) % 6])
}

/** 获取卦宫五行索引 */
export function getPalaceElement(hexIdx) {
  const palace = HEXAGRAM_PALACE[hexIdx - 1]
  return TRIGRAM_ELEMENT[palace]
}

export function getPalaceTrigram(hexIdx) {
  return HEXAGRAM_PALACE[hexIdx - 1]
}

export function getPalaceTrigramName(hexIdx) {
  return TRIGRAM_NAMES[HEXAGRAM_PALACE[hexIdx - 1]]
}
