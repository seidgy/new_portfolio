<template>
  <div class="glass-card figma-flow-card">
    <div class="card-header">
      <span class="label">{{ $t('flow.userFlow') }}</span>
      <span class="canvas-zoom">92%</span>
    </div>
    
    <div class="flow-canvas">
      <!-- Row 1 -->
      <div class="flow-row">
        <div class="node">{{ $t('flow.landing') }}</div>
        <div class="arrow">
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
            <path d="M0 4h14M11 1l3 3-3 3" stroke="var(--text-discreet)" stroke-width="1.25"/>
          </svg>
        </div>
        <div class="node">{{ $t('flow.browse') }}</div>
        <div class="arrow">
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
            <path d="M0 4h14M11 1l3 3-3 3" stroke="var(--text-discreet)" stroke-width="1.25"/>
          </svg>
        </div>
        <div class="node active">{{ $t('flow.detail') }}</div>
        <div class="arrow">
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
            <path d="M0 4h14M11 1l3 3-3 3" stroke="var(--text-discreet)" stroke-width="1.25"/>
          </svg>
        </div>
        <div class="node">{{ $t('flow.action') }}</div>
      </div>
      
      <!-- Connectors (subtle layout connector lines) -->
      <div class="connector-lines">
        <svg class="vertical-connector" width="100%" height="30" viewBox="0 0 200 30" fill="none">
          <path d="M 38,0 v15 h70 v15" stroke="rgba(42, 42, 53, 0.4)" stroke-width="1" stroke-dasharray="3 3"/>
          <path d="M 125,0 v15 h-45 v15" stroke="rgba(42, 42, 53, 0.4)" stroke-width="1" stroke-dasharray="3 3"/>
        </svg>
      </div>

      <!-- Row 2 -->
      <div class="flow-row sub-row">
        <div class="node mini">{{ $t('flow.search') }}</div>
        <div class="node mini">{{ $t('flow.filter') }}</div>
        <div class="node mini">{{ $t('flow.compare') }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.figma-flow-card {
  width: 320px;
  padding: var(--space-12, 12px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-family: var(--font-code);
    font-size: 0.65rem;
    color: var(--text-discreet);
    letter-spacing: 1px;
  }

  .canvas-zoom {
    font-family: var(--font-code);
    font-size: 0.65rem;
    color: var(--text-discreet);
  }
}

.flow-canvas {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 16px var(--space-12);
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.flow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &.sub-row {
    justify-content: center;
    gap: 14px;
    margin-top: 4px;
  }
}

.node {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;

  &.active {
    border-color: var(--color-primary);
    background: rgba(124, 92, 255, 0.08);
    color: var(--color-primary-hover);
    box-shadow: 0 0 10px rgba(124, 92, 255, 0.15);
  }

  &.mini {
    font-size: 0.625rem;
    color: var(--text-discreet);
    padding: 3px 8px;
  }

  &:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.connector-lines {
  height: 20px;
  display: flex;
  align-items: center;
}

.vertical-connector {
  width: 100%;
  height: 100%;
}
</style>
