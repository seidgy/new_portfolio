<template>
  <div class="glass-card chart-card">
    <div class="chart-header">
      <span class="label">{{ $t('chart.users') }}</span>
      <div class="metric">
        <span class="value">+32%</span>
        <span class="subtext">{{ $t('chart.vsLastMonth') }}</span>
      </div>
    </div>
    
    <div class="chart-container">
      <svg viewBox="0 0 200 80" class="sparkline">
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3"></stop>
            <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.0"></stop>
          </linearGradient>
        </defs>
        <!-- Area under path -->
        <path d="M 0,80 Q 20,70 40,65 T 80,45 T 120,40 T 160,25 T 200,10 L 200,80 Z" fill="url(#chart-grad)"></path>
        <!-- Sparkline path -->
        <path d="M 0,80 Q 20,70 40,65 T 80,45 T 120,40 T 160,25 T 200,10" fill="none" stroke="var(--color-primary)" stroke-width="2.5" class="chart-path"></path>
        
        <!-- Glowing dot at the end -->
        <circle cx="200" cy="10" r="4" fill="var(--color-primary)" class="glow-dot"></circle>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-card {
  width: 190px;
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-family: var(--font-code);
    font-size: 0.65rem;
    color: var(--text-discreet);
    letter-spacing: 1px;
  }

  .metric {
    display: flex;
    align-items: baseline;
    gap: 8px;

    .value {
      font-family: var(--font-title);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-success);
    }

    .subtext {
      font-size: 0.65rem;
      color: var(--text-discreet);
    }
  }
}

.chart-container {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.sparkline {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.chart-path {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: drawLine 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.glow-dot {
  opacity: 0;
  animation: fadeIn 0.5s ease-out 1.8s forwards, pulseGlow 2s infinite 2.3s;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes pulseGlow {
  0% { r: 4; fill-opacity: 1; }
  50% { r: 7; fill-opacity: 0.6; }
  100% { r: 4; fill-opacity: 1; }
}
</style>
