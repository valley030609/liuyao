<template>
  <div class="result-root">
    <!-- ====== 卦名区域 ====== -->
    <div class="result-title-area">
      <span class="result-palace">{{ palaceName }}卦</span>
      <h2 class="result-hex-name">{{ primary.name }}</h2>
      <p v-if="hasChanging" class="result-change-hint">
        之{{ changed.name }}
      </p>
    </div>

    <!-- ====== 时间 ====== -->
    <div v-if="calendar" class="result-time">
      {{ calendar.ganzhi.year }}年
      {{ calendar.ganzhi.month }}月
      {{ calendar.ganzhi.day }}日
      {{ calendar.ganzhi.hour }}时
      {{ calendar.shiChen?.name || '' }}时
    </div>

    <!-- ====== 六爻表格 (本卦 + 变卦同一排) ====== -->
    <div class="table-wrapper">
      <!-- 表头 -->
      <div class="table-header">
        <span class="th th--beast">六兽</span>
        <span class="th th--kin">六亲</span>
        <span class="th th--najia">世应·纳甲</span>
        <span class="th th--yao">爻</span>
        <span class="th th--pos">位</span>
        <template v-if="hasChanging">
          <span class="th th--divider"></span>
          <span class="th th--changed-kin">变卦·六亲</span>
          <span class="th th--changed-najia">变卦·纳甲</span>
          <span class="th th--changed-yao">变卦·爻</span>
        </template>
      </div>

      <!-- 表体: 上爻在上, 初爻在下 -->
      <YaoLine
        v-for="i in 6"
        :key="i"
        :line="resolvedLines[6 - i]"
        :position-index="6 - i"
        :is-shi="6 - i === shiYing?.shi"
        :is-ying="6 - i === shiYing?.ying"
        :najia="najiaData ? najiaData[6 - i] : null"
        :kin="sixKins ? sixKins[6 - i] : ''"
        :beast="sixBeasts[6 - i]"
        :changed-najia="changedNajiaData ? changedNajiaData[6 - i] : null"
        :changed-kin="(hasChanging && changedSixKins) ? changedSixKins[6 - i] : ''"
        :changed-line="hasChanging ? changedResolvedLines[6 - i] : null"
        :show-changed="hasChanging"
      />
    </div>

    <!-- ====== 互卦 ====== -->
    <div v-if="mutual" class="extra-hex">
      <span class="extra-label">互卦</span>
      <span class="extra-name">{{ mutual.name }}</span>
      <span class="extra-symbols">
        {{ mutual.lowerSymbol }}{{ mutual.upperSymbol }}
      </span>
    </div>

    <!-- ====== 卦辞 ====== -->
    <div class="guaci-card">
      <div class="guaci-title">卦辞</div>
      <p class="guaci-text">{{ primary.description }}</p>
    </div>

    <!-- 动爻详情 -->
    <div v-if="hasChanging" class="dongyao-card">
      <div class="guaci-title">
        动爻
        <span class="dongyao-count">({{ changingLines.length }})</span>
      </div>
      <div class="dongyao-list">
        <span
          v-for="cl in changingLines"
          :key="cl.position"
          class="dongyao-tag"
        >
          {{ POSITION_NAMES[cl.position] }}
          <span class="dongyao-tag-arrow">
            {{ cl.isYang ? '⚊→⚋' : '⚋→⚊' }}
          </span>
          {{ cl.label }}
        </span>
      </div>
    </div>

    <!-- ====== 操作按钮 ====== -->
    <div class="result-actions">
      <button class="btn-back" @click="$emit('reset')">
        ↺ 重新排卦
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import YaoLine from './YaoLine.vue'
import { YAO_OPTIONS, POSITION_NAMES as PN } from '../composables/useLiuYao.js'

const POSITION_NAMES = PN

const props = defineProps({
  lines: { type: Array, required: true },
  primary: { type: Object, required: true },
  changed: { type: Object, default: null },
  mutual: { type: Object, default: null },
  shiYing: { type: Object, default: null },
  changingLines: { type: Array, default: () => [] },
  // 新增
  calendar: { type: Object, default: null },
  palaceName: { type: String, default: '' },
  najiaData: { type: Array, default: null },
  changedNajiaData: { type: Array, default: null },
  sixKins: { type: Array, default: null },
  changedSixKins: { type: Array, default: null },
  sixBeasts: { type: Array, default: () => [] },
})

defineEmits(['reset'])

const hasChanging = computed(() => props.changed !== null && props.changingLines.length > 0)

const resolvedLines = computed(() => props.lines.filter(Boolean))

/** 变卦的爻象数据 */
const changedResolvedLines = computed(() => {
  if (!props.changed) return []
  return props.lines.map((l, i) => {
    if (!l) return null
    const flipped = l.isChanging ? !l.isYang : l.isYang
    // Return a simple line-like object for display
    const symbol = flipped ? '⚊' : '⚋'
    return { ...l, isYang: flipped, symbol, isChanging: false }
  })
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.result-root {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

// ====== 卦名 ======
.result-title-area {
  text-align: center;
  padding: $spacing-md 0 0;
}

.result-palace {
  display: inline-block;
  padding: 1px 12px;
  border-radius: 10px;
  background: rgba($color-primary, 0.12);
  color: $color-primary;
  font-size: $font-size-xs;
  margin-bottom: $spacing-sm;
}

.result-hex-name {
  font-size: 2.2rem;
  font-weight: 700;
  color: $color-primary;
  letter-spacing: 4px;
}

.result-change-hint {
  font-size: $font-size-lg;
  color: $color-text-muted;
  margin-top: $spacing-xs;

  &::before {
    content: '→ ';
    color: $color-changing;
  }
}

// ====== 时间 ======
.result-time {
  text-align: center;
  font-size: $font-size-sm;
  color: $color-text-muted;
  padding: 2px $spacing-md;
}

// ====== 表格 ======
.table-wrapper {
  background: $color-bg-card;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 4px 4px;
  border-bottom: 1px solid rgba($color-border, 0.4);
  font-size: 10px;
  color: $color-text-muted;
  text-align: center;
}

.th {
  display: flex;
  justify-content: center;
  padding: 0 2px;

  &--beast { width: 36px; }
  &--kin   { width: 36px; }
  &--najia { flex: 1; justify-content: flex-start; padding-left: 6px; }
  &--yao   { width: 44px; }
  &--pos   { width: 36px; }
  &--divider { width: 8px; border-left: 1px solid rgba($color-border, 0.6); }
  &--changed-kin { width: 36px; }
  &--changed-najia { flex: 1; justify-content: flex-start; padding-left: 4px; }
  &--changed-yao { width: 44px; }
}

// ====== 变卦 ======
.changed-section {
  .changed-label {
    text-align: center;
    font-size: $font-size-xs;
    color: $color-text-muted;
    padding: $spacing-xs 0;
    letter-spacing: 4px;
  }
}

// ====== 互卦 ======
.extra-hex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $color-bg-card;
  border-radius: $radius-md;
  border: 1px solid $color-border;
}

.extra-label {
  font-size: $font-size-xs;
  color: $color-text-muted;
}

.extra-name {
  font-size: $font-size-base;
  color: $color-text;
  font-weight: 600;
}

.extra-symbols {
  font-size: $font-size-xl;
}

// ====== 卦辞 ======
.guaci-card {
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: $spacing-lg;
  border: 1px solid $color-border;
}

.guaci-title {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-primary;
  margin-bottom: $spacing-sm;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.guaci-text {
  font-size: $font-size-sm;
  color: $color-text-muted;
  line-height: 1.6;
  font-style: italic;
}

// ====== 动爻 ======
.dongyao-card {
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: $spacing-lg;
  border: 1px solid rgba($color-changing, 0.25);
}

.dongyao-count {
  font-weight: 400;
  color: $color-text-muted;
}

.dongyao-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.dongyao-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: $radius-sm;
  background: rgba($color-changing, 0.1);
  font-size: $font-size-sm;
  color: $color-changing;
}

.dongyao-tag-arrow {
  font-size: $font-size-xs;
  opacity: 0.7;
}

// ====== 按钮 ======
.result-actions {
  display: flex;
  justify-content: center;
  padding-bottom: $spacing-xl;
}

.btn-back {
  padding: $spacing-md $spacing-2xl;
  border-radius: $radius-xl;
  background: transparent;
  border: 1px solid $color-border;
  color: $color-text-muted;
  font-size: $font-size-sm;
  transition: all $transition-base;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }
}
</style>
