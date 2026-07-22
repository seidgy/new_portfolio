<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { playSound } from '../utils/sound'
import Lenis from 'lenis'

const { locale } = useI18n()

const isDark = ref(true)
const sharedIsDark = useState('isDark', () => true)

watch(sharedIsDark, (newVal) => {
  isDark.value = newVal
}, { immediate: true })

interface ParallaxItem {
  el: HTMLElement
  initialTop: number
  height: number
  speed: number
}

const email = ref('hello@amano.solutions')
const parallaxItems = ref<ParallaxItem[]>([])
let lenisInstance: Lenis | null = null
let resizeListener: () => void

const copyEmail = () => {
  navigator.clipboard.writeText(email.value)
  playSound('success')
  alert(locale.value === 'pt' ? 'E-mail copiado!' : 'Email copied!')
}

const handleHover = () => {
  playSound('hover')
}

const handleClick = () => {
  playSound('click')
}

// Viewport-relative Scroll Parallax Logic (optimized: no bounding client queries on scroll!)
const handleParallax = () => {
  const scrolled = window.scrollY
  const viewportHeight = window.innerHeight

  parallaxItems.value.forEach((item) => {
    // Current top/bottom relative to viewport
    const relativeTop = item.initialTop - scrolled
    const relativeBottom = relativeTop + item.height
    
    // Check if element is active in viewport
    if (relativeTop < viewportHeight && relativeBottom > 0) {
      // Calculate progress of element through viewport (0 at bottom, 1 at top)
      const progress = (viewportHeight - relativeTop) / (viewportHeight + item.height)
      
      // Calculate offset shift (centered at progress 0.5)
      // Base multiplier is 800 for high visual impact
      const translation = (progress - 0.5) * item.speed * 800
      
      // Apply CSS transform
      item.el.style.transform = `translateY(${translation.toFixed(2)}px)`
    }
  })
}

onMounted(() => {
  // Load theme
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    sharedIsDark.value = false
    document.documentElement.classList.add('light-theme')
  }
  nextTick(() => {
    // Initialize Lenis smooth momentum scroll
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    // Hook parallax updates directly to Lenis scroll ticks
    lenisInstance.on('scroll', () => {
      handleParallax()
    })

    // Lenis loop animation frame
    let rafId: number
    function raf(time: number) {
      lenisInstance?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Elements query setup & static offset caching
    const queryElements = () => {
      const elements = document.querySelectorAll('.parallax-el')
      
      // Reset transforms temporarily to read natural layout offset tops
      elements.forEach((el) => {
        (el as HTMLElement).style.transform = 'none'
      })
      
      // Cache heights and document-relative positions
      parallaxItems.value = Array.from(elements).map((el) => {
        const htmlEl = el as HTMLElement
        const rect = htmlEl.getBoundingClientRect()
        return {
          el: htmlEl,
          initialTop: rect.top + window.scrollY,
          height: rect.height,
          speed: parseFloat(htmlEl.getAttribute('data-parallax-speed') || '0.1')
        }
      })
      
      // Initial render frame
      handleParallax()
    }

    queryElements()
    // Redundant trigger to ensure lazy images and layouts are fully settled
    setTimeout(queryElements, 300)

    // Sync on resize
    resizeListener = queryElements
    window.addEventListener('resize', resizeListener)
  })
})

onUnmounted(() => {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener)
  }
})
</script>

<template>
  <div class="portfolio-page">
    
    <!-- 01 HERO SECTION (Minimalist, System-thinking, bold) -->
    <section id="home" class="section-home">
      <div class="hero-grid">
        <!-- Left: Engineering & Design -->
        <div class="hero-left-col parallax-el" data-parallax-speed="0.12">
          <div class="title-meta">
            <span class="sub">{{ $t('hero.sub') }}</span>
            <span class="desc font-mono">{{ $t('hero.desc') }}</span>
          </div>
        </div>

        <!-- Right: Professional bio -->
        <div class="hero-right-col font-mono parallax-el" data-parallax-speed="-0.08">
          <p class="bio-paragraph">
            {{ $t('hero.bio') }}
          </p>
        </div>

        <!-- Bottom: Giant kinetic title -->
        <div class="hero-bottom-statement parallax-el" data-parallax-speed="0.06">
          <h2>
            <span>{{ $t('hero.bring') }}</span><br />
            <span class="highlight">{{ $t('hero.craftEng') }}</span><br />
            <span>{{ $t('hero.toProducts') }}</span>
          </h2>
        </div>
      </div>

      <!-- Scroll link -->
      <div class="hero-scroll-indicator">
        <a href="#work" class="explore-link font-mono" @mouseenter="handleHover" @click="handleClick">
          {{ $t('hero.scrollLink') }}
        </a>
      </div>
    </section>

    <!-- 02 SELECTED WORK SECTION (Asymmetric grid, editorial layout) -->
    <section id="work" class="section-work">
      <div class="section-header">
        <span class="section-num font-mono">{{ $t('work.title') }}</span>
      </div>

      <!-- Widescreen Asymmetrical Project Showcase -->
      <div class="asymmetric-work-grid">
        <!-- Row 1 Left: Pelando (7 columns) -->
        <article class="project-span-7 parallax-el" data-parallax-speed="-0.05">
          <div class="project-link-card">
            <div class="project-canvas pelando-bg">
              <span class="canvas-tag font-mono">UX RESEARCH</span>
              <img 
                :src="locale === 'pt' ? '/images/pelando_mockup_pt.jpg' : '/images/pelando_mockup_en.jpg'" 
                alt="Pelando App Case Study" 
                class="project-canvas-img" 
              />
              <div class="canvas-kpi font-mono">1.3★ → 4.7★</div>
            </div>
            
            <div class="project-meta">
              <h3 class="project-title">{{ $t('work.pelando.title') }}</h3>
              <p class="project-desc">{{ $t('work.pelando.desc') }}</p>
              
              <div class="project-tags">
                <span class="tag">{{ $t('tags.research') }}</span>
                <span class="tag">{{ $t('tags.strategy') }}</span>
                <span class="tag">{{ $t('tags.analytics') }}</span>
              </div>
              
              <a href="#contact" class="ask-link" @click="handleClick">{{ $t('work.askLink') }}</a>
            </div>
          </div>
        </article>

        <!-- Row 1 Right: Harvard & NYU (5 columns) -->
        <article class="project-span-5 parallax-el" data-parallax-speed="0.05">
          <div class="project-link-card">
            <div class="project-canvas institutions-bg">
              <span class="canvas-tag font-mono">{{ $t('work.institutions.tag') }}</span>
              <img 
                src="/images/institutions_mockup.jpg" 
                alt="Websites for World-Class Institutions Case Study" 
                class="project-canvas-img" 
              />
              <div class="canvas-kpi font-mono">Websites</div>
            </div>
            
            <div class="project-meta">
              <h3 class="project-title">{{ $t('work.institutions.title') }}</h3>
              <p class="project-desc">{{ $t('work.institutions.desc') }}</p>
              
              <div class="project-tags">
                <span class="tag">{{ $t('tags.engineering') }}</span>
                <span class="tag">{{ $t('tags.performance') }}</span>
                <span class="tag">{{ $t('tags.cms') }}</span>
              </div>
              
              <a href="#contact" class="ask-link" @click="handleClick">{{ $t('work.askLink') }}</a>
            </div>
          </div>
        </article>

        <!-- Row 2 Left: STF (5 columns) -->
        <article class="project-span-5 parallax-el" data-parallax-speed="0.04">
          <div class="project-link-card">
            <div class="project-canvas stf-bg">
              <span class="canvas-tag font-mono">{{ $t('work.stf.tag') }}</span>
              <img 
                :src="locale === 'pt' ? '/images/stf_mockup_pt.jpg' : '/images/stf_mockup_en.jpg'" 
                alt="STF Accessibility Case Study" 
                class="project-canvas-img stf-img" 
              />
              <div class="canvas-kpi font-mono">{{ $t('work.stf.kpi') }}</div>
            </div>
            
            <div class="project-meta">
              <h3 class="project-title">{{ $t('work.stf.title') }}</h3>
              <p class="project-desc">{{ $t('work.stf.desc') }}</p>
              
              <div class="project-tags">
                <span class="tag">{{ $t('tags.ux') }}</span>
                <span class="tag">{{ $t('tags.accessibility') }}</span>
                <span class="tag">{{ $t('tags.designSystem') }}</span>
              </div>
              
              <a href="#contact" class="ask-link" @click="handleClick">{{ $t('work.askLink') }}</a>
            </div>
          </div>
        </article>

        <!-- Row 2 Right: Banco do Brasil (7 columns) -->
        <article class="project-span-7 parallax-el" data-parallax-speed="-0.04">
          <div class="project-link-card">
            <div class="project-canvas bb-bg">
              <span class="canvas-tag font-mono">{{ $t('tags.strategy') }}</span>
              <img 
                src="/images/bb_mockup.jpg" 
                alt="Banco do Brasil Case Study" 
                class="project-canvas-img" 
              />
              <div class="canvas-kpi font-mono">60M+ Users</div>
            </div>
            
            <div class="project-meta">
              <h3 class="project-title">{{ $t('work.bb.title') }}</h3>
              <p class="project-desc">{{ $t('work.bb.desc') }}</p>
              
              <div class="project-tags">
                <span class="tag">{{ $t('tags.researchOps') }}</span>
                <span class="tag">{{ $t('tags.strategy') }}</span>
                <span class="tag">{{ $t('tags.workshops') }}</span>
              </div>
              
              <a href="#contact" class="ask-link" @click="handleClick">{{ $t('work.askLink') }}</a>
            </div>
          </div>
        </article>
      </div>

      <!-- TRUSTED BY LOGOS -->
      <div class="trusted-by-container">
        <span class="trusted-title font-mono">{{ $t('trustedBy') }}</span>
        <div class="logo-list">
          <img :src="`/images/harvard_logo${isDark ? '' : '-light'}.png`" alt="Harvard" class="trusted-logo" :class="{ 'trusted-logo--light': !isDark  }" @mouseenter="handleHover" />
          <img :src=  "`/images/facebook_logo${isDark ? '' : '-light'}.png`" alt="Facebook" class="trusted-logo" :class="{ 'trusted-logo--light': !isDark  }" @mouseenter="handleHover" />
          <img :src="`/images/unicef_logo${isDark ? '' : '-light'}.png`" alt="UNICEF" class="trusted-logo" :class="{ 'trusted-logo--light': !isDark  }" @mouseenter="handleHover" />
          <img :src="`/images/nyu_logo${isDark ? '' : '-light'}.png`" alt="NYU" class="trusted-logo" :class="{ 'trusted-logo--light': !isDark  }" @mouseenter="handleHover" />
          <img :src="`/images/bb_logo${isDark ? '' : '-light'}.png`" alt="Banco do Brasil" class="trusted-logo" :class="{ 'trusted-logo--light': !isDark  }" @mouseenter="handleHover" />
          <img :src="`/images/stf_logo${isDark ? '' : '-light'}.png`" alt="STF" class="trusted-logo" :class="{ 'trusted-logo--light': !isDark  }" @mouseenter="handleHover" />
        </div>
      </div>
    </section>

    <!-- 03 SERVICES SECTION (WHITE BAND, INVERTS ON LIGHT THEME) -->
    <section id="services" class="section-services">
      <div class="services-wrapper">
        <div class="profile-photo-col parallax-el" data-parallax-speed="0.08">
          <div class="photo-container">
            <img src="/images/avatar.svg" alt="Seidgy Amano" class="profile-img" />
          </div>
        </div>
        
        <div class="profile-text-col">
          <span class="services-num font-mono">{{ $t('services.title') }}</span>
          <h2 class="profile-title">{{ $t('services.subtitle') }}</h2>
          <p class="profile-desc">
            {{ $t('services.desc') }}
          </p>
        </div>

        <div class="profile-stats-col parallax-el" data-parallax-speed="-0.08">
          <div class="stat-item">
            <span class="stat-val">15+</span>
            <span class="stat-lbl font-mono">{{ $t('services.stats.years') }}</span>
            <span class="stat-sub">{{ $t('services.stats.buildingDesc') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-val">7+</span>
            <span class="stat-lbl font-mono">{{ $t('services.stats.years') }}</span>
            <span class="stat-sub">{{ $t('services.stats.leadingDesc') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-val">{{ $t('services.stats.millions') }}</span>
            <span class="stat-lbl font-mono">{{ $t('services.stats.ofUsers') }}</span>
            <span class="stat-sub">{{ $t('services.stats.impactedDesc') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-val">{{ $t('services.stats.latam') }}</span>
            <span class="stat-lbl font-mono">{{ $t('services.stats.experience') }}</span>
            <span class="stat-sub">{{ $t('services.stats.culturesDesc') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 04 PLAYBOOKS SECTION -->
    <section id="playbooks" class="section-playbooks">
      <div class="section-header ">
        <span class="section-num font-mono">{{ $t('playbooks.title') }}</span>
        <h2 class="section-title">{{ $t('playbooks.subtitle') }}</h2>
      </div>

      <div class="playbooks-grid">
        <div 
          class="playbook-card glass-card parallax-el"
          data-parallax-speed="-0.06"
          @mouseenter="handleHover"
        >
          <span class="num font-mono">01 /</span>
          <h3>{{ $t('playbooks.item1.title') }}</h3>
          <p>{{ $t('playbooks.item1.desc') }}</p>
        </div>
        
        <div 
          class="playbook-card glass-card parallax-el"
          data-parallax-speed="0.06"
          @mouseenter="handleHover"
        >
          <span class="num font-mono">02 /</span>
          <h3>{{ $t('playbooks.item2.title') }}</h3>
          <p>{{ $t('playbooks.item2.desc') }}</p>
        </div>
        
        <div 
          class="playbook-card glass-card parallax-el"
          data-parallax-speed="-0.04"
          @mouseenter="handleHover"
        >
          <span class="num font-mono">03 /</span>
          <h3>{{ $t('playbooks.item3.title') }}</h3>
          <p>{{ $t('playbooks.item3.desc') }}</p>
        </div>
      </div>
    </section>

    <!-- 05 ABOUT SECTION -->
    <section id="about" class="section-about">
      <div class="section-header">
        <span class="section-num font-mono">{{ $t('about.title') }}</span>
      </div>
      
      <div class="about-story">
        <h2 class="story-title">{{ $t('about.subtitle') }}</h2>
        <p class="story-intro">
          {{ $t('about.desc') }}
        </p>

        <div class="story-timeline">
          <div class="story-step">
            <div class="step-marker">
              <span class="marker-dot"></span>
              <span class="marker-line"></span>
            </div>
            <div class="step-content">
              <h3>{{ $t('about.step1.title') }}</h3>
              <p>{{ $t('about.step1.desc') }}</p>
            </div>
          </div>

          <div class="story-step">
            <div class="step-marker">
              <span class="marker-dot"></span>
              <span class="marker-line"></span>
            </div>
            <div class="step-content">
              <h3>{{ $t('about.step2.title') }}</h3>
              <p>{{ $t('about.step2.desc') }}</p>
            </div>
          </div>

          <div class="story-step">
            <div class="step-marker">
              <span class="marker-dot"></span>
            </div>
            <div class="step-content">
              <h3>{{ $t('about.step3.title') }}</h3>
              <p>{{ $t('about.step3.desc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 06 CONTACT SECTION -->
    <section id="contact" class="section-contact">
      <div class="contact-box font-mono">
        <span class="section-num">{{ $t('contact.title') }}</span>
        <h2 class="contact-title parallax-el" data-parallax-speed="0.1">
          <span>{{ $t('contact.subtitle.line1') }}</span><br />
          <span>{{ $t('contact.subtitle.line2') }}</span><br />
          <span>{{ $t('contact.subtitle.line3') }}</span><br />
          <span class="highlight">{{ $t('contact.subtitle.line4') }}</span>
        </h2>
        
        <p class="contact-desc">
          {{ $t('contact.desc') }}
        </p>

        <div class="email-container">
          <button 
            class="email-btn" 
            @mouseenter="handleHover" 
            @click="copyEmail" 
            aria-label="Copy Email"
          >
            <span class="email-text">{{ email }}</span>
            <span class="copy-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </span>
          </button>
        </div>

        <div class="contact-details">
          <!--<div class="detail-item">
            <span class="lbl">{{ $t('contact.locationLabel') }}</span>
            <span class="val">{{ $t('contact.locationValue') }}</span>
          </div>-->
          <div class="detail-item">
            <span class="lbl">{{ $t('contact.socialLabel') }}</span>
            <span class="val links">
              <a href="https://linkedin.com/in/seidgy" target="_blank" rel="noopener" @mouseenter="handleHover" @click="handleClick">LinkedIn</a> / 
              <a href="https://github.com/seidgy" target="_blank" rel="noopener" @mouseenter="handleHover" @click="handleClick">GitHub</a>
            </span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style lang="scss" scoped>
.section-header {
  margin-bottom: 30px;
}
.portfolio-page {
  padding: 0 var(--space-48);
  display: flex;
  flex-direction: column;
  gap: var(--space-128);
  padding-bottom: 80px; // space for bottom telemetry bar
  overflow: hidden; // prevents horizontal scrollbars during parallax transforms
  
  @include respond-to(mobile) {
    padding: 0 var(--space-24);
    gap: var(--space-64);
    padding-bottom: 60px;
  }
}

// Parallax elements transition
.parallax-el {
  will-change: transform;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  
  // Disable animation on devices that prefer reduced motion for accessibility
  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
    transition: none !important;
  }
}

// 01 HERO SECTION
.section-home {
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: var(--space-48);
  position: relative;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-24);
  align-items: flex-start;
  text-align: left;
}

.hero-left-col {
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  gap: var(--space-32);

  @include respond-to(mobile) {
    grid-column: span 12;
  }
}

.title-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);

  .sub {
    font-family: var(--font-title);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .desc {
    font-size: 0.725rem;
    color: var(--text-discreet);
    letter-spacing: 0.5px;
  }
}

.signature-container {
  width: 100%;
  max-width: 320px;
  opacity: 0.9;
}

.svg-signature {
  width: 100%;
  height: auto;
  overflow: visible;

  .sig-path {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: drawSignature 2.2s cubic-bezier(0.42, 0, 0.58, 1) forwards 0.4s;
  }
}

@keyframes drawSignature {
  to {
    stroke-dashoffset: 0;
  }
}

.hero-right-col {
  grid-column: span 6;
  padding-left: var(--space-48);

  @include respond-to(mobile) {
    grid-column: span 12;
    padding-left: 0;
    margin-top: var(--space-16);
  }

  .bio-paragraph {
    font-family: var(--font-code);
    font-size: 0.8125rem;
    line-height: 1.6;
    color: var(--text-secondary);
    max-width: 420px;
    letter-spacing: 0.25px;
  }
}

.hero-bottom-statement {
  grid-column: span 12;
  margin-top: var(--space-64);

  h2 {
    font-family: var(--font-title);
    font-size: 6vw;
    font-weight: 900;
    line-height: 0.9;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: -2px;

    @include respond-to(mobile) {
      font-size: 10vw;
      letter-spacing: -1px;
    }

    .highlight {
      color: var(--color-primary-hover);
      text-shadow: var(--glow-primary);
    }
  }
}

.hero-scroll-indicator {
  margin-top: var(--space-48);
  display: flex;
  justify-content: flex-start;

  .explore-link {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--text-discreet);
    letter-spacing: 1px;
    border: 1px dotted transparent;
    padding: 6px 12px;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }
  }
}

// 02 SELECTED WORK SECTION (Asymmetrical Grid)
.section-work {
  display: flex;
  flex-direction: column;
}

.asymmetric-work-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-128) var(--space-48);
  margin: 0 auto var(--space-96) auto;
  max-width: 1200px;
  width: 100%;

  @include respond-to(mobile) {
    grid-template-columns: 1fr;
    gap: var(--space-64);
    margin-bottom: var(--space-64);
  }
}

// Spans for asymmetrical columns
.project-span-8 {
  grid-column: span 8;
  @include respond-to(mobile) { grid-column: span 1; }
}

.project-span-7 {
  grid-column: span 7;
  @include respond-to(mobile) { grid-column: span 1; }
}

.project-span-6 {
  grid-column: span 6;
  @include respond-to(mobile) { grid-column: span 1; }
}

.project-span-5 {
  grid-column: span 5;
  @include respond-to(mobile) { grid-column: span 1; }
}

// Alignments for variable offsets
.project-align-right {
  justify-self: end;
  width: 100%;
}

.project-align-left {
  justify-self: start;
  width: 100%;
}

.project-link-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  width: 100%;
}

.project-canvas {
  width: 100%;
  aspect-ratio: 1.6 / 1;
  background-color: var(--bg-secondary);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-card);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;

  @include respond-to(mobile) {
    aspect-ratio: 1.2 / 1;
  }

  &:hover {
    border-color: var(--text-primary);
    box-shadow: var(--shadow-soft);
    
    .logo-badge {
      transform: scale(1.06);
    }

    .project-canvas-img {
      transform: scale(1.05);
    }
  }

  .project-canvas-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);

    &.stf-img {
      object-position: left center;
    }
  }

  .canvas-tag {
    position: absolute;
    top: 16px;
    right: 16px;
    background: var(--bg-primary);
    border: 1px dotted var(--border-color);
    padding: 3px 8px;
    font-size: 0.6rem;
    color: var(--text-discreet);
    text-transform: uppercase;
    z-index: 5;
  }

  .canvas-kpi {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: var(--bg-primary);
    border: 1px dotted var(--border-color);
    padding: 3px 8px;
    font-size: 0.6rem;
    color: var(--color-success);
    z-index: 5;
  }

  &.pelando-bg {
    background: linear-gradient(135deg, #FF5E36 0%, #7C5CFF 100%);
  }
  
  &.stf-bg {
    background: linear-gradient(135deg, #1E3C72 0%, #2A5298 100%);
  }
  
  &.institutions-bg {
    background: linear-gradient(135deg, #0A192F 0%, #172A45 100%);
  }
  
  &.bb-bg {
    background: linear-gradient(135deg, #FEDF00 0%, #F1C40F 100%);
  }

  .logo-badge {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 900;
    font-family: var(--font-title);
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    
    &.pelando-logo {
      font-size: 2.5rem;
      letter-spacing: -1.5px;
      .flame {
        margin-right: 6px;
        filter: drop-shadow(0 0 12px rgba(255, 94, 54, 0.6));
      }
    }
    
    &.stf-logo {
      font-size: 3rem;
      letter-spacing: -1.5px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
      padding-bottom: 4px;
    }
    
    &.institutions-logo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-12);
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      
      span {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 4px 8px;
        border-radius: 4px;
        text-align: center;
      }
    }
    
    &.bb-logo {
      color: #003399;
      font-size: 1.75rem;
      letter-spacing: -0.5px;
      border: 2px solid #003399;
      padding: 6px 14px;
      border-radius: 4px;
    }
  }
}

.trusted-by-container {
  margin-top: var(--space-96);
  padding-top: var(--space-64);
  border-top: 1px dashed var(--border-color);
  text-align: center;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  .trusted-title {
    display: block;
    font-size: 0.65rem;
    font-family: var(--font-code);
    color: var(--text-discreet);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: var(--space-48);
  }

  .logo-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-48) var(--space-64);
    
    @include respond-to(mobile) {
      gap: var(--space-32);
    }
  }

  .trusted-logo {
    height: 28px;
    width: auto;
    object-fit: contain;
    filter: grayscale(100%) opacity(0.35);
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

    &:hover {
      filter: grayscale(0%) opacity(0.85);
      transform: translateY(-2px);
    }

    @include respond-to(mobile) {
      height: 22px;
    }
  }

  .trusted-logo--light {
    filter: grayscale(0%) opacity(0.35);
  }
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: 0 var(--space-4);
  text-align: left;
}

.project-title {
  font-family: var(--font-title);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
}

.project-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 600px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin-top: var(--space-4);

  .tag {
    font-size: 0.6rem;
    font-family: var(--font-code);
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border-color);
    padding: 3px 8px;
    border-radius: var(--radius-tag);
    color: var(--text-discreet);
  }
}

.ask-link {
  font-family: var(--font-code);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-primary-hover);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-top: var(--space-8);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    color: var(--text-primary);
    transform: translateX(4px);
  }
}

// 03 SERVICES SECTION
.section-services {
  margin-left: -48px;
  margin-right: -48px;
  background-color: #ffffff;
  color: #121218;
  padding: var(--space-96) var(--space-48);
  border-top: 1px solid #e2e2e9;
  border-bottom: 1px solid #e2e2e9;
  position: relative;
  z-index: 10;
  transition: background-color 0.3s, border-color 0.3s;

  :root.light-theme & {
    background-color: #0c0c10;
    color: #f8f8fa;
    border-color: #1c1c28;
  }

  @include respond-to(mobile) {
    margin-left: -24px;
    margin-right: -24px;
    padding: var(--space-64) var(--space-24);
  }
}

.services-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 1fr;
  gap: var(--space-64);
  align-items: center;

  @include respond-to(desktop) {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-48);

    .profile-stats-col {
      grid-column: span 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  @include respond-to(mobile) {
    grid-template-columns: 1fr;
    gap: var(--space-32);

    .profile-stats-col {
      grid-column: span 1;
      grid-template-columns: 1fr;
    }
  }
}

.profile-photo-col {
  display: flex;
  justify-content: center;

  .photo-container {
    position: relative;
    width: 200px;
    height: 260px;
    border-radius: 12px;
    overflow: hidden;
    background: #09090b;

    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.profile-text-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  .services-num {
    font-size: 0.725rem;
    color: var(--color-primary);
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: var(--space-16);
  }

  .profile-title {
    font-family: var(--font-title);
    font-size: 2.75rem;
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -1.5px;
    color: #121218;
    margin-bottom: var(--space-24);

    :root.light-theme & {
      color: #f8f8fa;
    }

    @include respond-to(mobile) {
      font-size: 2rem;
    }
  }

  .profile-desc {
    font-size: 1rem;
    line-height: 1.6;
    color: #4b4b5c;

    :root.light-theme & {
      color: #b6b6c5;
    }
  }
}

.profile-stats-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.stat-item {
  border-left: 2px solid #e2e2e9;
  padding-left: var(--space-16);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  :root.light-theme & {
    border-left-color: #2a2a35;
  }

  .stat-val {
    font-family: var(--font-title);
    font-size: 1.5rem;
    font-weight: 900;
    color: #121218;

    :root.light-theme & {
      color: #f8f8fa;
    }
  }

  .stat-lbl {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: 1px;
    margin: 2px 0 4px;
  }

  .stat-sub {
    font-size: 0.8125rem;
    color: #6c6c80;

    :root.light-theme & {
      color: #7d7d90;
    }
  }
}

// 04 PLAYBOOKS SECTION
.playbooks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-32);

  @include respond-to(mobile) {
    grid-template-columns: 1fr;
    gap: var(--space-24);
  }
}

.playbook-card {
  padding: var(--space-32) var(--space-24);
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .num {
    font-size: 0.725rem;
    color: var(--color-primary);
    font-weight: 700;
    margin-bottom: var(--space-24);
  }

  h3 {
    font-family: var(--font-title);
    font-size: 1.35rem;
    font-weight: 800;
    margin-bottom: var(--space-16);
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    line-height: 1.6;
  }
}

// 05 ABOUT SECTION
.about-story {
  max-width: 720px;
  margin: 0 auto;
  text-align: left;

  .story-title {
    font-family: var(--font-title);
    font-size: 2.75rem;
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -1.5px;
    color: var(--text-primary);
    margin-bottom: var(--space-24);

    @include respond-to(mobile) {
      font-size: 2rem;
    }
  }

  .story-intro {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: var(--space-48);
  }
}

.story-timeline {
  display: flex;
  flex-direction: column;
}

.story-step {
  display: flex;
  gap: var(--space-32);

  .step-marker {
    display: flex;
    flex-direction: column;
    align-items: center;

    .marker-dot {
      width: 8px;
      height: 8px;
      background-color: var(--color-primary);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--color-primary);
    }

    .marker-line {
      flex: 1;
      width: 1px;
      background-color: var(--border-color);
      margin: 8px 0;
      min-height: 80px;
    }
  }

  .step-content {
    padding-bottom: var(--space-32);
    
    h3 {
      font-family: var(--font-title);
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.6;
    }
  }
}

// 06 CONTACT SECTION
.section-contact {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-box {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-96) var(--space-48);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @include respond-to(mobile) {
    padding: var(--space-48) var(--space-24);
  }

  .section-num {
    font-size: 0.725rem;
    color: var(--color-primary);
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: var(--space-24);
  }

  .contact-title {
    font-family: var(--font-title);
    font-size: 6vw;
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -2px;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    margin-bottom: var(--space-32);
    text-transform: uppercase;
    text-align: center;
    display: block;

    @include respond-to(mobile) {
      font-size: 10vw;
      letter-spacing: -1px;
    }

    .highlight {
      color: var(--color-primary-hover);
      text-shadow: var(--glow-primary);
    }
  }

  .contact-desc {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.6;
    max-width: 440px;
    margin-bottom: var(--space-48);
  }
}

.email-container {
  margin-bottom: var(--space-48);

  .email-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-16);
    background: rgba(124, 92, 255, 0.05);
    border: 1px dotted var(--border-color);
    padding: var(--space-16) var(--space-32);
    border-radius: var(--radius-button);
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

    @include respond-to(mobile) {
      padding: var(--space-12) var(--space-16);
    }

    .email-text {
      font-family: var(--font-title);
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-primary-hover);
      letter-spacing: -0.5px;

      @include respond-to(mobile) {
        font-size: 0.95rem;
      }
    }

    .copy-badge {
      color: var(--text-discreet);
      display: flex;
      align-items: center;
    }

    &:hover {
      background: rgba(124, 92, 255, 0.1);
      border-color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(124, 92, 255, 0.15);

      .copy-badge {
        color: var(--color-primary);
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.contact-details {
  width: 100%;
  border-top: 1px dotted var(--border-color);
  padding-top: var(--space-32);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-24);

  @include respond-to(mobile) {
    gap: var(--space-16);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .lbl {
      font-size: 0.6rem;
      color: var(--text-discreet);
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .val {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--text-primary);
      
      &.links a {
        color: var(--color-primary-hover);
        border-bottom: 1px dotted transparent;
        
        &:hover {
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
      }
    }
  }
}
</style>
