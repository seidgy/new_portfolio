<template>
  <div class="glass-card code-card">
    <div class="editor-header">
      <div class="window-controls">
        <span class="control close"></span>
        <span class="control minimize"></span>
        <span class="control expand"></span>
      </div>
      <div class="tabs">
        <span class="tab active">example.vue</span>
      </div>
      <button class="copy-btn" aria-label="Copy Code">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
    
    <div class="code-body">
      <pre v-pre><code><span class="token tag">&lt;script</span> <span class="token attr-name">setup</span><span class="token tag">&gt;</span>
<span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token function">defineProps</span><span class="token punctuation">({</span>
  data<span class="token operator">:</span> Object
<span class="token punctuation">})</span>
<span class="token tag">&lt;/script&gt;</span>

<span class="token tag">&lt;template&gt;</span>
  <span class="token tag">&lt;section</span> <span class="token attr-name">class</span><span class="token attr-value">="card"</span><span class="token tag">&gt;</span>
    <span class="token tag">&lt;h2&gt;</span><span class="token interpolation"><span class="token punctuation">{{</span> props.data.title <span class="token punctuation">}}</span></span><span class="token tag">&lt;/h2&gt;</span>
  <span class="token tag">&lt;/section&gt;</span>
<span class="token tag">&lt;/template&gt;</span></code></pre>
    </div>

    <div class="editor-footer">
      <span class="tag-meta">Vue</span>
      <span class="tag-meta">Nuxt</span>
      <span class="tag-meta">TypeScript</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-card {
  width: 250px;
  padding: 0;
  overflow: hidden;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--border-color);

  .window-controls {
    display: flex;
    gap: 6px;

    .control {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      
      &.close { background-color: #ff5f56; }
      &.minimize { background-color: #ffbd2e; }
      &.expand { background-color: #27c93f; }
    }
  }

  .tabs {
    font-family: var(--font-code);
    font-size: 0.6875rem;
    color: var(--text-secondary);
    
    .tab {
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.03);
    }
  }

  .copy-btn {
    color: var(--text-discreet);
    &:hover { color: var(--color-primary); }
  }
}

.code-body {
  padding: 16px;
  background: rgba(5, 5, 7, 0.4);
  font-family: var(--font-code);
  font-size: 0.725rem;
  line-height: 1.5;
  text-align: left;
  white-space: pre;
  overflow-x: auto;

  pre {
    margin: 0;
  }

  // Code token styling
  .token {
    &.tag { color: #f43f5e; }
    &.attr-name { color: #fb923c; }
    &.attr-value { color: #38bdf8; }
    &.keyword { color: #c084fc; }
    &.function { color: #60a5fa; }
    &.operator { color: var(--text-secondary); }
    &.punctuation { color: var(--text-discreet); }
    &.interpolation { color: #3ddc84; }
  }
}

.editor-footer {
  display: flex;
  gap: var(--space-8);
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid var(--border-color);

  .tag-meta {
    font-family: var(--font-code);
    font-size: 0.6rem;
    color: var(--text-discreet);
    text-transform: uppercase;
  }
}
</style>
