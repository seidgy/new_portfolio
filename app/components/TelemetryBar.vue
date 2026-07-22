<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const timeStr = ref('--:--:--')
const cursorX = ref('0000')
const cursorY = ref('0000')
const scrollPercent = ref('000')

let timeInterval: number

const updateTime = () => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  timeStr.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const handleMouseMove = (e: MouseEvent) => {
  cursorX.value = e.clientX.toString().padStart(4, '0')
  cursorY.value = e.clientY.toString().padStart(4, '0')
}

const handleScroll = () => {
  const doc = document.documentElement
  const scrollTop = window.scrollY || doc.scrollTop
  const scrollHeight = doc.scrollHeight - doc.clientHeight
  const percent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
  scrollPercent.value = percent.toString().padStart(3, '0')
}

onMounted(() => {
  updateTime()
  timeInterval = window.setInterval(updateTime, 1000)
  
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('scroll', handleScroll)
  handleScroll() // initial load
})

onUnmounted(() => {
  clearInterval(timeInterval)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="telemetry-bar font-mono">
    <div class="telemetry-container">
      <!-- Left: Clock -->
      <span class="telemetry-item timezone-clock">
        GMT-3 BR {{ timeStr }}
      </span>

      <!-- Center: Cursor X / Y -->
      <span class="telemetry-item coordinates">
        {{ cursorX }} X / {{ cursorY }} Y
      </span>

      <!-- Right: Scroll -->
      <span class="telemetry-item scroll-pct">
        {{ $t('scroll') }} {{ scrollPercent }}%
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.telemetry-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: var(--bg-primary-transparent);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-top: 1px solid var(--border-color);
  z-index: 100;
  display: flex;
  align-items: center;
  pointer-events: none; // does not intercept clicks
}

.telemetry-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-48);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-code);
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: var(--text-discreet);
  
  @include respond-to(mobile) {
    padding: 0 var(--space-24);
    
    // Hide mouse coordinates on touch mobile devices
    .coordinates {
      display: none;
    }
  }
}

.telemetry-item {
  text-transform: uppercase;
}
</style>
