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

/** 六十四卦表: [name, upperTrigram, lowerTrigram, description] */
const HEXAGRAM_TABLE = [
  // 0-7: 上卦乾☰
  ['乾为天', 0, 0, '元亨利贞，自强不息'],
  ['泽天夬', 0, 1, '决断果行，去除小人'],
  ['火天大有', 0, 2, '丰收富有，遏恶扬善'],
  ['雷天大壮', 0, 3, '强盛壮大，非礼勿行'],
  ['风天小畜', 0, 4, '小有蓄积，以懿文德'],
  ['水天需', 0, 5, '等待时机，饮食宴乐'],
  ['山天大畜', 0, 6, '大蓄积力，多识前言'],
  ['地天泰', 0, 7, '天地交泰，辅相天地'],

  // 8-15: 上卦兑☱
  ['天泽履', 1, 0, '如履薄冰，辨上下定民志'],
  ['兑为泽', 1, 1, '喜悦和乐，朋友讲习'],
  ['火泽睽', 1, 2, '乖离违逆，以同而异'],
  ['雷泽归妹', 1, 3, '婚嫁归宿，永终知敝'],
  ['风泽中孚', 1, 4, '诚信中正，议狱缓死'],
  ['水泽节', 1, 5, '节制有度，制数度议德行'],
  ['山泽损', 1, 6, '损下益上，惩忿窒欲'],
  ['地泽临', 1, 7, '临下亲民，教思无穷'],

  // 16-23: 上卦离☲
  ['天火同人', 2, 0, '大同于人，类族辨物'],
  ['泽火革', 2, 1, '变革更新，治历明时'],
  ['离为火', 2, 2, '光明依附，照临四方'],
  ['雷火丰', 2, 3, '丰大盛明，折狱致刑'],
  ['风火家人', 2, 4, '治家有道，言有物行有恒'],
  ['水火既济', 2, 5, '事已成就，思患豫防'],
  ['山火贲', 2, 6, '文饰之美，明庶政无敢折狱'],
  ['地火明夷', 2, 7, '光明受伤，莅众用晦而明'],

  // 24-31: 上卦震☳
  ['天雷无妄', 3, 0, '真实无妄，茂对时育万物'],
  ['泽雷随', 3, 1, '随从顺时，向晦入宴息'],
  ['火雷噬嗑', 3, 2, '决断刑狱，明罚敕法'],
  ['震为雷', 3, 3, '震动警醒，恐惧修省'],
  ['风雷益', 3, 4, '增益利民，见善则迁有过则改'],
  ['水雷屯', 3, 5, '初生艰难，经纶天下'],
  ['山雷颐', 3, 6, '颐养身心，慎言语节饮食'],
  ['地雷复', 3, 7, '一阳来复，闭关休养'],

  // 32-39: 上卦巽☴
  ['天风姤', 4, 0, '不期而遇，施命诰四方'],
  ['泽风大过', 4, 1, '大过寻常，独立不惧遁世无闷'],
  ['火风鼎', 4, 2, '鼎立更新，正位凝命'],
  ['雷风恒', 4, 3, '恒久不变，立不易方'],
  ['巽为风', 4, 4, '柔顺入微，申命行事'],
  ['水风井', 4, 5, '井养不穷，劳民劝相'],
  ['山风蛊', 4, 6, '整治弊病，振民育德'],
  ['地风升', 4, 7, '上升渐进，积小以高大'],

  // 40-47: 上卦坎☵
  ['天水讼', 5, 0, '争讼辨明，作事谋始'],
  ['泽水困', 5, 1, '困厄艰难，致命遂志'],
  ['火水未济', 5, 2, '事未成就，慎辨物居方'],
  ['雷水解', 5, 3, '解除困难，赦过宥罪'],
  ['风水涣', 5, 4, '涣散聚合，享帝立庙'],
  ['坎为水', 5, 5, '重重险阻，常德行习教事'],
  ['山水蒙', 5, 6, '启蒙开智，果行育德'],
  ['地水师', 5, 7, '出师用兵，容民畜众'],

  // 48-55: 上卦艮☶
  ['天山遁', 6, 0, '退避隐遁，远小人不恶而严'],
  ['泽山咸', 6, 1, '感应相与，虚受人'],
  ['火山旅', 6, 2, '旅行在外，明慎用刑不留狱'],
  ['雷山小过', 6, 3, '小有过越，行过乎恭丧过乎哀'],
  ['风山渐', 6, 4, '渐进有序，居贤德善俗'],
  ['水山蹇', 6, 5, '艰难跋涉，反身修德'],
  ['艮为山', 6, 6, '止其所止，思不出其位'],
  ['地山谦', 6, 7, '谦虚卑下，裒多益寡称物平施'],

  // 56-63: 上卦坤☷
  ['天地否', 7, 0, '天地闭塞，俭德辟难'],
  ['泽地萃', 7, 1, '聚集荟萃，除戎器戒不虞'],
  ['火地晋', 7, 2, '前进光明，自昭明德'],
  ['雷地豫', 7, 3, '愉悦安乐，作乐崇德'],
  ['风地观', 7, 4, '观察省视，省方观民设教'],
  ['水地比', 7, 5, '亲比依附，建万国亲诸侯'],
  ['山地剥', 7, 6, '剥落衰败，厚下安宅'],
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
  [7, 5, 3, 1, 11, 9],  // 坤☷: 未巳卯丑亥酉
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
 * 六十四卦卦宫归属
 * 索引=六十四卦序号-1, 值=卦宫八卦索引(0乾1兑2离3震4巽5坎6艮7坤)
 */
const HEXAGRAM_PALACE = [
  0,0,0,0,0,0,0,0, // 1-8   乾宫
  3,3,3,3,3,3,3,3, // 9-16  震宫
  7,7,7,7,7,7,7,7, // 17-24 坤宫
  4,4,4,4,4,4,4,4, // 25-32 巽宫
  5,5,5,5,5,5,5,5, // 33-40 坎宫
  2,2,2,2,2,2,2,2, // 41-48 离宫
  6,6,6,6,6,6,6,6, // 49-56 艮宫
  1,1,1,1,1,1,1,1, // 57-64 兑宫
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
  const allBranches = [...lowerBranches.slice(0, 3), ...upperBranches.slice(0, 3)]

  const lowerStemInfo = NAJIA_STEMS[lowerTrigram]
  const upperStemInfo = NAJIA_STEMS[upperTrigram]

  return allBranches.map((branchIdx, i) => {
    const stemIdx = i < 3 ? lowerStemInfo.inner : upperStemInfo.inner
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

export function getSixKin(palaceElementIdx, yaoElementIdx) {
  // palaceElement = "我", yaoElement = 爻的地支五行
  const palaceEl = palaceElementIdx
  const yaoEl = yaoElementIdx
  // 五行相生: 金生水(1→4), 水生木(4→2), 木生火(2→3), 火生土(3→0), 土生金(0→1)
  // 简化: (myIdx + 1) % 5 = I-generate
  //        (myIdx + 4) % 5 = generates-me
  //        (myIdx + 2) % 5 = I-restrain
  //        (myIdx + 3) % 5 = restrains-me
  if (yaoEl === palaceEl) return 4  // 兄弟 (同我)
  if ((palaceEl + 1) % 5 === yaoEl) return 2 // 妻财 (我克→我生? Wait...)
  // Let me re-derive:
  // 五行: 0金 1水 2木 3火 4土
  // 生: 金→水→木→火→土→金  i.e., 0→1→2→3→4→0
  // So element X 生 (X+1)%5
  // 克: 金克木, 水克火, 木克土, 火克金, 土克水
  // 克关系: 0克2, 1克3, 2克4, 3克0, 4克1
  // So element X 克 (X+2)%5
  if (yaoEl === (palaceEl + 1) % 5) return 1 // 我生→子孙
  if (yaoEl === (palaceEl + 3) % 5) return 3 // 克我→官鬼
  if (yaoEl === (palaceEl + 4) % 5) return 0 // 生我→父母
  if (yaoEl === (palaceEl + 2) % 5) return 2 // 我克→妻财
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
