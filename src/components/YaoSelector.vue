<template>
  <div class="yao-selector">
    <h3 class="selector-title">选择六爻（自下而上：初爻 → 上爻）</h3>

    <div class="yao-rows">
      <!-- 上爻在上，初爻在下（倒序渲染） -->
      <div
        v-for="posIndex in 6"
        :key="6 - posIndex"
        class="yao-row"
        :class="{
          'yao-row--selected': lines[5 - posIndex + 1].value !== null,
          'yao-row--shi': isShi(5 - posIndex + 1),
          'yao-row--ying': isYing(5 - posIndex + 1),
        }"
      >
        <!-- 位置标签 + 世应标记 -->
        <div class="yao-row-label">
          <span class="yao-pos-name">{{ posNames[5 - posIndex + 1] }}</span>
          <span v-if="isShi(5 - posIndex + 1)" class="marker marker--shi">世</span>
          <span v-else-if="isYing(5 - posIndex + 1)" class="marker marker--ying">应</span>
        </div>

        <!-- 四个选项按钮 (9老阳/8少阴/7少阳/6老阴) -->
        <div class="yao-options">
          <button
            v-for="opt in yaoOptions"
            :key="opt.value"
            class="yao-opt"
            :class="{
              'yao-opt--active': lines[5 - posIndex + 1].value === opt.value,
              'yao-opt--changing': opt.isChanging,
              'yao-opt--yang': opt.isYang,
              'yao-opt--yin': !opt.isYang,
            }"
            @click="$emit('select', 5 - posIndex + 1, opt.value)"
          >
            <span class="yao-opt-symbol">{{ opt.symbol }}</span>
            <span class="yao-opt-label">{{ opt.label }}</span>
          </button>
        </div>

        <!-- 选中预览 -->
        <div v-if="lines[5 - posIndex + 1].value !== null" class="yao-preview">
          <span
            class="yao-preview-bar"
            :class="{
              'yao-preview-bar--yang': getOpt(5 - posIndex + 1)?.isYang,
              'yao-preview-bar--yin': !getOpt(5 - posIndex + 1)?.isYang,
              'yao-preview-bar--changing': getOpt(5 - posIndex + 1)?.isChanging,
              'yao-preview-bar--broken': !getOpt(5 - posIndex + 1)?.isYang,
            }"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { YAO_OPTIONS, POSITION_NAMES } from '../composables/useLiuYao.js'

const props = defineProps({
  lines: { type: Array, required: true },
  shiYing: { type: Object, default: null },
})

defineEmits(['select'])

const yaoOptions = YAO_OPTIONS
const posNames = POSITION_NAMES // ['初爻','二爻','三爻','四爻','五爻','上爻'] 0-based

function getOpt(index) {
  const val = props.lines[index].value
  if (val === null) return null
  return YAO_OPTIONS.find(o => o.value === val)
}

function isShi(index) {
  return props.shiYing?.shi === index
}

function isYing(index) {
  return props.shiYing?.ying === index
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.yao-selector {
  background: $color-bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid $color-border;
}

.selector-title {
  font-size: $font-size-sm;
  color: $color-text-muted;
  font-weight: 500;
  margin-bottom: $spacing-lg;
  text-align: center;
}

.yao-rows {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.yao-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  background: rgba($color-text-muted, 0.04);
  transition: all $transition-base;

  &--selected {
    background: rgba($color-primary, 0.06);
  }

  &--shi {
    border-left: 3px solid $color-primary;
  }

  &--ying {
    border-left: 3px solid rgba($color-primary, 0.35);
  }
}

.yao-row-label {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.yao-pos-name {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-text;
}

.marker {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  text-align: center;

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

// 选项按钮
.yao-options {
  display: flex;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.yao-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 4px 8px;
  border-radius: $radius-sm;
  background: transparent;
  border: 1px solid rgba($color-text-muted, 0.2);
  color: $color-text-muted;
  cursor: pointer;
  transition: all $transition-base;
  min-width: 44px;
  flex: 1;
  max-width: 64px;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }

  &--active {
    border-color: $color-primary;
    background: rgba($color-primary, 0.12);
    color: $color-primary;

    &.yao-opt--changing {
      border-color: $color-changing;
      background: rgba($color-changing, 0.12);
      color: $color-changing;
    }
  }
}

.yao-opt-symbol {
  font-size: $font-size-lg;
  line-height: 1;
}

.yao-opt-label {
  font-size: 10px;
  font-weight: 500;
}

// 预览
.yao-preview {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.yao-preview-bar {
  display: block;
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: $color-yang;

  &--yin {
    background: $color-yin;
    // broken: two shorter bars
    background: transparent;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      width: calc(50% - 6px);
      height: 5px;
      border-radius: 3px;
      background: $color-yang;
    }

    &::before { left: 0; }
    &::after { right: 0; }
  }

  &--changing {
    background: $color-changing !important;

    &::before,
    &::after {
      background: $color-changing !important;
    }
  }
}
</style>
