<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const targetX = ref(0)
const targetY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  
  // Normalize coordinates between -0.5 and 0.5
  targetX.value = (e.clientX - rect.left) / rect.width - 0.5
  targetY.value = (e.clientY - rect.top) / rect.height - 0.5
}

// Smooth lerp animation loop
let animationFrameId: number
const updateParallax = () => {
  mouseX.value += (targetX.value - mouseX.value) * 0.08
  mouseY.value += (targetY.value - mouseY.value) * 0.08
  animationFrameId = requestAnimationFrame(updateParallax)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  updateParallax()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div ref="containerRef" class="floating-workspace">
    <!-- SVG Connection Lines -->
    <svg class="workspace-connections" viewBox="0 0 500 500" fill="none">
      <!-- Path connecting Interview -> Figma Flow -> Code -> PostHog Chart -->
      <path 
        d="M 120,120 Q 200,160 250,220 T 380,180 T 400,320" 
        stroke="rgba(124, 92, 255, 0.15)" 
        stroke-width="1.5" 
        stroke-dasharray="6 4"
      />
      <path 
        d="M 80,310 Q 150,340 250,280" 
        stroke="rgba(78, 168, 255, 0.15)" 
        stroke-width="1.25"
      />
    </svg>

    <!-- Card 1: User Interview (Top Left) -->
    <div 
      class="card-wrapper w-interview" 
      :style="{ transform: `translate(${mouseX * 25}px, ${mouseY * 25}px)` }"
    >
      <UserInterviewCard />
    </div>

    <!-- Card 2: Post-It Note (Middle Left) -->
    <div 
      class="card-wrapper w-postit" 
      :style="{ transform: `translate(${mouseX * 40}px, ${mouseY * 40}px) rotate(-6deg)` }"
    >
      <div class="postit-note">
        <p class="handwritten">{{ $t('postit.line1') }}</p>
        <p class="handwritten highlight">{{ $t('postit.line2') }}</p>
        <div class="tape"></div>
      </div>
    </div>

    <!-- Card 3: Figma Flow (Center) -->
    <div 
      class="card-wrapper w-flow" 
      :style="{ transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)` }"
    >
      <FigmaFlowCard />
    </div>

    <!-- Card 4: PostHog Chart (Bottom Center) -->
    <div 
      class="card-wrapper w-chart" 
      :style="{ transform: `translate(${mouseX * 30}px, ${mouseY * 30}px)` }"
    >
      <PostHogChartCard />
    </div>

    <!-- Card 5: Code Card (Top Right) -->
    <div 
      class="card-wrapper w-code" 
      :style="{ transform: `translate(${mouseX * 20}px, ${mouseY * 20}px)` }"
    >
      <CodeCard />
    </div>

    <!-- Card 6: CSS Button Snippet (Bottom Right) -->
    <div 
      class="card-wrapper w-css" 
      :style="{ transform: `translate(${mouseX * 35}px, ${mouseY * 35}px)` }"
    >
      <div class="glass-card css-code-block">
        <div class="css-header">
          <span class="dot"></span>
          <span class="file-name">button.css</span>
        </div>
        <pre class="css-body"><code><span class="cls">.btn-primary</span> {
  <span class="prop">background</span>: <span class="val">linear-gradient</span>(90deg,
    <span class="var">#7C5CFF</span>, <span class="var">#A855F7</span>);
  <span class="prop">border</span>: <span class="val">none</span>;
  <span class="prop">padding</span>: <span class="val">12px 24px</span>;
  <span class="prop">border-radius</span>: <span class="val">14px</span>;
}</code></pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.floating-workspace {
  position: relative;
  width: 100%;
  height: 500px;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  
  @include respond-to(mobile) {
    height: auto;
    min-height: auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-24);
    padding: var(--space-32) 0;
  }
}

.workspace-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;

  @include respond-to(mobile) {
    display: none;
  }
}

.card-wrapper {
  position: absolute;
  z-index: 1;
  transition: transform 0.1s ease-out; // smooth layout updates
  will-change: transform;

  @include respond-to(mobile) {
    position: relative;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
    display: flex;
    justify-content: center;
  }
}

// Desktop Positioning coordinates
.w-interview {
  top: 15px;
  left: 15px;
}

.w-postit {
  top: 130px;
  left: 140px;
  z-index: 5; // overlaps flow and interview
}

.w-flow {
  top: 240px;
  left: 20px;
}

.w-chart {
  bottom: 20px;
  left: 210px;
  z-index: 2;
}

.w-code {
  top: 0px;
  right: 15px;
}

.w-css {
  bottom: 40px;
  right: 25px;
}

// Hand-written postit styling
.postit-note {
  width: 160px;
  background-color: #581c87; // deep purple post-it
  background-image: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
  padding: 20px 16px;
  border-radius: 2px;
  box-shadow: 2px 10px 24px rgba(0, 0, 0, 0.4);
  position: relative;
  border-bottom-right-radius: 12px 2px; // slightly curled edge

  .handwritten {
    font-family: 'Outfit', cursive, sans-serif;
    font-size: 0.825rem;
    font-weight: 500;
    color: #e9d5ff;
    line-height: 1.35;
    
    &.highlight {
      font-weight: 700;
      color: #fff;
    }
  }

  .tape {
    position: absolute;
    top: -12px;
    left: 45px;
    width: 60px;
    height: 18px;
    background-color: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(2px);
    transform: rotate(-3deg);
    border: 1px solid rgba(255,255,255,0.05);
  }
}

// CSS Code Block Card
.css-code-block {
  width: 220px;
  padding: var(--space-12, 12px);
}

.css-header {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 6px;
  margin-bottom: 8px;

  .dot {
    width: 6px;
    height: 6px;
    background-color: var(--color-primary);
    border-radius: 50%;
  }

  .file-name {
    font-family: var(--font-code);
    font-size: 0.65rem;
    color: var(--text-discreet);
  }
}

.css-body {
  font-family: var(--font-code);
  font-size: 0.6875rem;
  line-height: 1.45;
  text-align: left;
  margin: 0;

  .cls { color: #f472b6; }
  .prop { color: #818cf8; }
  .val { color: #38bdf8; }
  .var { color: #3ddc84; }
}
</style>
