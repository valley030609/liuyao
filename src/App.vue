<template>
  <div class="app">
    <!-- 顶部标题栏 -->
    <header class="app-header">
      <h1 class="app-title">☯ 六爻排卦</h1>
      <p class="app-subtitle">手动选爻 · 干支时间</p>
    </header>

    <!-- 主要内容区 -->
    <main class="app-main">
      <!-- 排卦前：时间选择 + 选爻 -->
      <template v-if="!showResult">
        <!-- 时间选择器 -->
        <TimePicker ref="timePickerRef" />

        <!-- 爻选择器 -->
        <YaoSelector
          :lines="lines"
          :shi-ying="shiYing"
          @select="handleSelect"
        />

        <!-- 排卦按钮 -->
        <button
          class="btn-paigua"
          :disabled="!isComplete"
          @click="handlePaiGua"
        >
          {{ isComplete ? '☯ 排卦' : `请选择六爻 (已选 ${selectedCount}/6)` }}
        </button>
      </template>

      <!-- 排卦后：结果展示 -->
      <template v-else>
        <HexagramResult
          :lines="resolvedLines"
          :primary="primaryHexagram"
          :changed="changedHexagram"
          :mutual="mutualHexagram"
          :shi-ying="shiYing"
          :changing-lines="changingLines"
          :calendar="calendarData"
          :palace-name="palaceName"
          :najia-data="najiaData"
          :changed-najia-data="changedNajiaData"
          :six-kins="sixKins"
          :changed-six-kins="changedSixKins"
          :six-beasts="sixBeasts"
          @reset="handleReset"
        />
      </template>
    </main>

    <!-- 底部信息 -->
    <footer class="app-footer">
      <span>六爻排卦 · 仅供参考</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLiuYao } from './composables/useLiuYao.js'
import TimePicker from './components/TimePicker.vue'
import YaoSelector from './components/YaoSelector.vue'
import HexagramResult from './components/HexagramResult.vue'

const {
  lines,
  isComplete,
  resolvedLines,
  changingLines,
  primaryHexagram,
  changedHexagram,
  mutualHexagram,
  shiYing,
  hasChanging,
  // 纳甲
  najiaData,
  changedNajiaData,
  palaceName,
  sixKins,
  changedSixKins,
  sixBeasts,
  calendarData,
  setLine,
  setCalendar,
  reset,
} = useLiuYao()

const timePickerRef = ref(null)
const showResult = ref(false)

const selectedCount = computed(() => lines.filter(l => l.value !== null).length)

function handleSelect(index, value) {
  setLine(index, value)
}

function handlePaiGua() {
  if (!isComplete.value) return
  // 传入时间数据
  const cal = timePickerRef.value?.calendarResult
  if (cal) setCalendar(cal)
  showResult.value = true
}

function handleReset() {
  showResult.value = false
  reset()
}
</script>

<style lang="scss" scoped>
@use './styles/variables' as *;

.app {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.app-header {
  text-align: center;
  padding: $spacing-xl 0 $spacing-lg;
}

.app-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  color: $color-primary;
  letter-spacing: 2px;
}

.app-subtitle {
  font-size: $font-size-sm;
  color: $color-text-muted;
  margin-top: $spacing-sm;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  padding-bottom: $spacing-2xl;
}

// 排卦按钮
.btn-paigua {
  width: 100%;
  padding: $spacing-lg;
  border-radius: $radius-xl;
  font-size: $font-size-lg;
  font-weight: 700;
  background: linear-gradient(135deg, $color-primary, #c99a31);
  color: #1a1a2e;
  transition: all $transition-base;
  letter-spacing: 2px;

  &:disabled {
    background: rgba($color-text-muted, 0.15);
    color: $color-text-muted;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):hover {
    box-shadow: $shadow-glow;
  }
}

// 排卦后的时间标签
.result-time-badge {
  text-align: center;
  padding: $spacing-sm $spacing-lg;
  background: rgba($color-primary, 0.08);
  border-radius: $radius-xl;
  font-size: $font-size-sm;
  color: $color-primary;
  border: 1px solid rgba($color-primary, 0.15);
}

// Footer
.app-footer {
  text-align: center;
  padding: $spacing-lg 0;
  font-size: $font-size-xs;
  color: $color-text-muted;
  border-top: 1px solid $color-border;
}
</style>
