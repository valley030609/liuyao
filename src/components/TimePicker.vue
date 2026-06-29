<template>
  <div class="time-picker">
    <!-- 模式切换 -->
    <div class="tp-tabs">
      <button
        :class="['tp-tab', { 'tp-tab--active': mode === 'gregorian' }]"
        @click="mode = 'gregorian'"
      >
        📅 公历
      </button>
      <button
        :class="['tp-tab', { 'tp-tab--active': mode === 'ganzhi' }]"
        @click="mode = 'ganzhi'"
      >
        ☯ 干支
      </button>
    </div>

    <!-- 公历模式 -->
    <div v-if="mode === 'gregorian'" class="tp-panel">
      <div class="tp-row">
        <div class="tp-field tp-field--year">
          <label class="tp-label">年</label>
          <input
            type="number"
            class="tp-input"
            :value="gregorianYear"
            @input="gregorianYear = +$event.target.value"
            min="1900" max="2100"
          />
        </div>
        <div class="tp-field tp-field--month">
          <label class="tp-label">月</label>
          <select class="tp-select" v-model.number="gregorianMonth">
            <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
          </select>
        </div>
        <div class="tp-field tp-field--day">
          <label class="tp-label">日</label>
          <select class="tp-select" v-model.number="gregorianDay">
            <option v-for="d in daysInMonth" :key="d" :value="d">{{ d }}日</option>
          </select>
        </div>
      </div>

      <div class="tp-row">
        <div class="tp-field tp-field--hour">
          <label class="tp-label">时</label>
          <select class="tp-select" v-model.number="gregorianHour">
            <option v-for="h in 23" :key="h" :value="h">{{ String(h).padStart(2, '0') }}</option>
          </select>
        </div>
        <div class="tp-field tp-field--minute">
          <label class="tp-label">分</label>
          <select class="tp-select" v-model.number="gregorianMinute">
            <option v-for="m in 59" :key="m" :value="m">{{ String(m).padStart(2, '0') }}</option>
          </select>
        </div>
      </div>

      <!-- 干支预览 -->
      <div class="tp-preview">
        <span class="tp-preview-label">干支历:</span>
        <span class="tp-preview-gz">{{ gzYear }}年 {{ gzMonth }}月 {{ gzDay }}日 {{ gzHour }}时</span>
        <span class="tp-preview-shichen">({{ shiChenName }})</span>
      </div>
    </div>

    <!-- 干支模式 -->
    <div v-if="mode === 'ganzhi'" class="tp-panel">
      <div class="tp-row">
        <div class="tp-field tp-field--gz">
          <label class="tp-label">年干支</label>
          <select class="tp-select" v-model="gzYearIdx">
            <option v-for="(gz, i) in SIXTY_CYCLE" :key="i" :value="i">{{ gz }}</option>
          </select>
        </div>
      </div>
      <div class="tp-row">
        <div class="tp-field tp-field--gz">
          <label class="tp-label">月干支</label>
          <select class="tp-select" v-model="gzMonthIdx">
            <option v-for="(gz, i) in SIXTY_CYCLE" :key="i" :value="i">{{ gz }}</option>
          </select>
        </div>
      </div>
      <div class="tp-row">
        <div class="tp-field tp-field--gz">
          <label class="tp-label">日干支</label>
          <select class="tp-select" v-model="gzDayIdx">
            <option v-for="(gz, i) in SIXTY_CYCLE" :key="i" :value="i">{{ gz }}</option>
          </select>
        </div>
      </div>
      <div class="tp-row">
        <div class="tp-field tp-field--gz">
          <label class="tp-label">时干支</label>
          <select class="tp-select" v-model="gzHourIdx">
            <option v-for="(gz, i) in SIXTY_CYCLE" :key="i" :value="i">{{ gz }}</option>
          </select>
        </div>
      </div>

      <!-- 公历预览 -->
      <div class="tp-preview">
        <span class="tp-preview-label">公历:</span>
        <span class="tp-preview-gz">
          {{ gregorianYear }}-{{ String(gregorianMonth).padStart(2, '0') }}-{{ String(gregorianDay).padStart(2, '0') }}
          {{ String(gregorianHour).padStart(2, '0') }}:{{ String(gregorianMinute).padStart(2, '0') }}
        </span>
      </div>
    </div>

    <!-- 快捷按钮 -->
    <div class="tp-actions">
      <button class="tp-btn-now" @click="initWithNow">🕐 当前时间</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCalendar } from '../composables/useCalendar.js'

const {
  gregorianYear, gregorianMonth, gregorianDay, gregorianHour, gregorianMinute,
  gzYear, gzMonth, gzDay, gzHour, shiChenName,
  calendarResult,
  initWithNow,
  HEAVENLY_STEMS, EARTHLY_BRANCHES, SIXTY_CYCLE,
} = useCalendar()

const mode = ref('gregorian')

// 干支索引 (用于 select)
const gzYearIdx = ref(0)
const gzMonthIdx = ref(0)
const gzDayIdx = ref(0)
const gzHourIdx = ref(0)

// 同步干支 → 索引
function syncGzToIdx() {
  const yi = SIXTY_CYCLE.indexOf(gzYear.value)
  const mi = SIXTY_CYCLE.indexOf(gzMonth.value)
  const di = SIXTY_CYCLE.indexOf(gzDay.value)
  const hi = SIXTY_CYCLE.indexOf(gzHour.value)
  gzYearIdx.value = yi >= 0 ? yi : 0
  gzMonthIdx.value = mi >= 0 ? mi : 0
  gzDayIdx.value = di >= 0 ? di : 0
  gzHourIdx.value = hi >= 0 ? hi : 0
}

// 公历 → 干支 自动同步已在 useCalendar 中处理
// 干支手动选择后同步回 useCalendar
watch([gzYearIdx, gzMonthIdx, gzDayIdx, gzHourIdx], () => {
  if (mode.value !== 'ganzhi') return
  gzYear.value = SIXTY_CYCLE[gzYearIdx.value]
  gzMonth.value = SIXTY_CYCLE[gzMonthIdx.value]
  gzDay.value = SIXTY_CYCLE[gzDayIdx.value]
  gzHour.value = SIXTY_CYCLE[gzHourIdx.value]
})

// 初始化
syncGzToIdx()

/** 当月天数 */
const daysInMonth = computed(() => {
  return new Date(gregorianYear.value, gregorianMonth.value, 0).getDate()
})

// 确保日期在当月范围内
watch(gregorianMonth, () => {
  const max = daysInMonth.value
  if (gregorianDay.value > max) gregorianDay.value = max
})

// 暴露给父组件
defineExpose({ calendarResult })
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.time-picker {
  background: $color-bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid $color-border;
}

.tp-tabs {
  display: flex;
  gap: 0;
  margin-bottom: $spacing-lg;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $color-border;
}

.tp-tab {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  background: transparent;
  color: $color-text-muted;
  font-size: $font-size-sm;
  font-weight: 500;
  transition: all $transition-base;
  text-align: center;

  &--active {
    background: rgba($color-primary, 0.15);
    color: $color-primary;
  }
}

.tp-panel {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.tp-row {
  display: flex;
  gap: $spacing-sm;
}

.tp-field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &--year { flex: 2; }
  &--month { flex: 1; }
  &--day { flex: 1; }
  &--hour { flex: 1; }
  &--minute { flex: 1; }
  &--gz { flex: 1; }
}

.tp-label {
  font-size: $font-size-xs;
  color: $color-text-muted;
  font-weight: 500;
}

.tp-input,
.tp-select {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-sm;
  border: 1px solid rgba($color-text-muted, 0.3);
  background: rgba($color-bg, 0.5);
  color: $color-text;
  font-size: $font-size-sm;
  font-family: inherit;
  outline: none;
  width: 100%;
  transition: border-color $transition-base;

  &:focus {
    border-color: $color-primary;
  }
}

.tp-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238892a4' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;
}

.tp-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: rgba($color-primary, 0.06);
  border-radius: $radius-sm;
  font-size: $font-size-sm;
}

.tp-preview-label {
  color: $color-text-muted;
  font-size: $font-size-xs;
}

.tp-preview-gz {
  color: $color-primary;
  font-weight: 500;
}

.tp-preview-shichen {
  color: $color-text-muted;
  font-size: $font-size-xs;
}

.tp-actions {
  display: flex;
  justify-content: center;
  margin-top: $spacing-md;
}

.tp-btn-now {
  padding: $spacing-sm $spacing-xl;
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
