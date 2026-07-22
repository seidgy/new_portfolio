<template>
  <div class="glass-card user-interview-card">
    <div class="card-header">
      <div class="indicator">
        <span class="live-dot"></span>
        <span class="indicator-text">{{ $t('interview.title') }}</span>
      </div>
      <span class="duration">45:12</span>
    </div>
    
    <div class="video-preview">
      <img src="/images/user_interview.png" alt="User Interview" class="preview-img" @error="handleImageError" />
      <div class="play-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"></path>
        </svg>
      </div>
      <div class="audio-wave">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleImageError = (e: Event) => {
  // If the image is not found, we use a CSS fallback (dark gradient)
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style lang="scss" scoped>
.user-interview-card {
  width: 220px;
  padding: var(--space-12, 12px);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    
    .live-dot {
      width: 6px;
      height: 6px;
      background-color: var(--color-primary);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--color-primary);
      animation: pulse 2s infinite;
    }

    .indicator-text {
      font-family: var(--font-code);
      font-size: 0.65rem;
      letter-spacing: 0.5px;
      color: var(--text-discreet);
    }
  }

  .duration {
    font-family: var(--font-code);
    font-size: 0.65rem;
    color: var(--color-primary);
  }
}

.video-preview {
  position: relative;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #1e1e28 0%, #0d0d12 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .preview-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
    filter: grayscale(1);
  }

  .play-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(124, 92, 255, 0.9);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: transform 0.2s ease, background 0.2s ease;
    box-shadow: 0 4px 12px rgba(124, 92, 255, 0.4);
    padding-left: 2px; // optical alignment for play triangle

    &:hover {
      transform: scale(1.1);
      background: var(--color-primary-hover);
    }
  }

  .audio-wave {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    gap: 3px;
    z-index: 2;

    span {
      width: 2px;
      height: 8px;
      background-color: var(--text-discreet);
      border-radius: 1px;
      animation: wave 1.2s ease-in-out infinite alternate;

      &:nth-child(2) { height: 14px; animation-delay: 0.15s; }
      &:nth-child(3) { height: 10px; animation-delay: 0.3s; }
      &:nth-child(4) { height: 6px; animation-delay: 0.45s; }
    }
  }
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

@keyframes wave {
  0% { transform: scaleY(0.4); }
  100% { transform: scaleY(1.2); }
}
</style>
