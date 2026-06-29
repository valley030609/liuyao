<template>
  <div
    class="yao-row"
    :class="{
      'yao-row--shi': isShi,
      'yao-row--ying': isYing,
      'yao-row--changing': line?.isChanging,
    }"
  >
    <!-- 六兽 -->
    <span class="yao-cell yao-cell--beast">{{ beast }}</span>

    <!-- 六亲 -->
    <span class="yao-cell yao-cell--kin">{{ kin }}</span>

    <!-- 世应 + 纳甲 -->
    <span class="yao-cell yao-cell--najia">
      <span v-if="isShi" class="badge badge--shi">世</span>
      <span v-else-if="isYing" class="badge badge--ying">应</span>
      <span v-else class="badge-placeholder"></span>
      {{ najiaName }}
    </span>

    <!-- 爻象 -->
    <span class="yao-cell yao-cell--symbol">
      <span v-if="line?.isChanging" class="changing-arrow">
        <span class="ca-from">{{ line.isYang ? '⚊' : '⚋' }}</span>
        <span class="ca-arrow">→</span>
        <span class="ca-to">{{ line.isYang ? '⚋' : '⚊' }}</span>
      </span>
      <span v-else class="yao-symbol">{{ line?.symbol || '' }}</span>
    </span>

    <!-- 分隔线 -->
    <span v-if="showChanged" class="yao-cell yao-cell--divider"></span>

    <!-- 变卦六亲 -->
    <span v-if="showChanged" class="yao-cell yao-cell--changed-kin">{{ changedKin }}</span>

    <!-- 变卦纳甲 -->
    <span v-if="showChanged" class="yao-cell yao-cell--changed-najia">
      {{ changedNajiaName }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  line: { type: Object, default: null },
  isShi: { type: Boolean, default: false },
  isYing: { type: Boolean, default: false },
  // 纳甲/六亲/六兽
  najia: { type: Object, default: null },
  kin: { type: String, default: '' },
  beast: { type: String, default: '' },
  changedNajia: { type: Object, default: null },
  changedKin: { type: String, default: '' },
  showChanged: { type: Boolean, default: false },
})

const najiaName = computed(() => props.najia?.fullName || '')
const changedNajiaName = computed(() => props.changedNajia?.fullName || '')
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.yao-row {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 6px 4px;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
  transition: background $transition-base;

  &:nth-child(odd) {
    background: rgba($color-text-muted, 0.03);
  }

  &--shi {
    background: rgba($color-primary, 0.08) !important;
    border-left: 3px solid $color-primary;
  }

  &--ying {
    background: rgba($color-primary, 0.04) !important;
    border-left: 3px solid rgba($color-primary, 0.3);
  }

  &--changing {
    .yao-symbol, .changing-arrow {
      color: $color-changing;
    }
  }
}

.yao-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  min-width: 0;

  &--beast {
    width: 36px;
    font-size: $font-size-xs;
  }

  &--kin {
    width: 36px;
    font-size: $font-size-xs;
  }

  &--najia {
    flex: 1;
    justify-content: flex-start;
    gap: 4px;
    padding-left: 2px;
    font-size: $font-size-sm;
    white-space: nowrap;
  }

  &--symbol {
    width: 44px;
    font-size: $font-size-lg;
  }

  &--changed-najia {
    flex: 1;
    justify-content: flex-start;
    font-size: $font-size-sm;
    color: $color-text-muted;
    white-space: nowrap;
    padding-left: 4px;
  }

  &--changed-kin {
    width: 36px;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &--divider {
    width: 8px;
    border-left: 1px solid rgba($color-border, 0.6);
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;

  &--shi {
    background: $color-primary;
    color: #1a1a2e;
  }

  &--ying {
    background: transparent;
    color: $color-primary;
    border: 1px solid $color-primary;
  }
}

.badge-placeholder {
  display: inline-block;
  width: 18px;
  flex-shrink: 0;
}
</style>
