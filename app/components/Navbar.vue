<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isSoundEnabled, playSound } from '../utils/sound'

const { locale, locales, setLocale } = useI18n()
const isDark = ref(true)
const isMobileOpen = ref(false)

const menuItems = [
  { id: 'work', key: 'nav.work' },
  { id: 'about', key: 'nav.about' },
  { id: 'contact', key: 'nav.contact' }
]

const changeLocale = (code: string) => {
  playSound('click')
  setLocale(code)
}

const toggleMobileMenu = () => {
  playSound('click')
  isMobileOpen.value = !isMobileOpen.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('light-theme', !isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  playSound('success')
}

const toggleSound = () => {
  isSoundEnabled.value = !isSoundEnabled.value
  localStorage.setItem('sound', isSoundEnabled.value ? 'on' : 'off')
  // We play success only after it becomes true
  if (isSoundEnabled.value) {
    playSound('success')
  }
}

onMounted(() => {
  // Load theme
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light-theme')
  }

  // Load sound config
  const savedSound = localStorage.getItem('sound')
  if (savedSound === 'on') {
    isSoundEnabled.value = true
  }
})

const handleHover = () => {
  playSound('hover')
}

const handleClick = () => {
  playSound('click')
}
</script>

<template>
  <header class="navbar-header font-mono">
    <div class="navbar-container">
      <!-- Left side: Logo -->
      <div class="nav-brand">
        <a href="#home" class="logo-sa" @mouseenter="handleHover" @click="handleClick">
          <img src="/images/logo-ng.svg" alt="Amano" class="logo-neg" v-if="isDark" />
          <img src="/images/logo.svg" alt="Amano" class="logo" v-else />
        </a>
      </div>

      <!-- Center: Menu (Desktop Only) -->
      <nav class="desktop-nav">
        <ul>
          <li v-for="item in menuItems" :key="item.id">
            <a 
              :href="`#${item.id}`" 
              class="nav-link"
              @mouseenter="handleHover"
              @click="handleClick"
            >
              {{ $t(item.key) }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- Right side: Actions -->
      <div class="nav-actions">
        <!-- Theme Toggle -->
        <button 
          class="action-btn" 
          @mouseenter="handleHover" 
          @click="toggleTheme"
          aria-label="Toggle Theme"
        >
          {{ $t('theme.theme') }}[{{ isDark ? $t('theme.dark') : $t('theme.light') }}]
        </button>



        <!-- Language switcher -->
        <div class="language-switcher">
          <button 
            v-for="loc in locales" 
            :key="loc.code" 
            class="lang-btn" 
            :class="{ 'is-active': locale === loc.code }"
            @mouseenter="handleHover"
            @click="changeLocale(loc.code)"
          >
            {{ $t(`languages.${loc.code}`) }}
          </button>
        </div>

        <!-- Mobile hamburger -->
        <button class="hamburger-btn" @click="toggleMobileMenu" aria-label="Toggle Menu">
          <svg v-if="!isMobileOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div class="mobile-drawer" :class="{ 'is-open': isMobileOpen }">
      <nav class="mobile-nav">
        <ul>
          <li v-for="item in menuItems" :key="item.id">
            <a 
              :href="`#${item.id}`" 
              class="mobile-nav-link"
              @click="toggleMobileMenu"
            >
              {{ $t(item.key) }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
    
    <!-- Mobile overlay -->
    <div class="mobile-overlay" :class="{ 'is-active': isMobileOpen }" @click="isMobileOpen = false"></div>
  </header>
</template>

<style lang="scss" scoped>
.navbar-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: var(--bg-primary-transparent);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  display: flex;
  align-items: center;
}

.navbar-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-48);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @include respond-to(mobile) {
    padding: 0 var(--space-24);
  }
}

.logo-sa {
  font-family: var(--font-title);
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px dotted transparent;
  padding: 4px 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--text-primary);
  }
}

.desktop-nav {
  @include respond-to(mobile) {
    display: none;
  }

  ul {
    display: flex;
    gap: var(--space-8);
  }
}

.nav-link {
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-primary);
  opacity: 0.8;
  padding: var(--space-8) var(--space-16);
  border: 1px dotted transparent;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    border-color: var(--text-primary);
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.action-btn {
  font-family: var(--font-code);
  font-size: 0.725rem;
  color: var(--text-primary);
  opacity: 0.8;
  padding: var(--space-8) var(--space-12);
  border: 1px dotted transparent;
  text-transform: uppercase;
  transition: all 0.2s;

  @include respond-to(mobile) {
    display: none; // hide theme/sound on mobile to keep layout clean
  }

  &:hover {
    opacity: 1;
    border-color: var(--text-primary);
  }
}

.language-switcher {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-button);
  padding: 2px;

  .lang-btn {
    padding: 3px 8px;
    font-size: 0.65rem;
    font-weight: 700;
    border-radius: 10px;
    color: var(--text-discreet);
    transition: all 0.2s ease;

    &.is-active {
      background: rgba(124, 92, 255, 0.12);
      color: var(--color-primary);
    }

    &:hover:not(.is-active) {
      color: var(--text-primary);
    }
  }
}

.hamburger-btn {
  display: none;
  color: var(--text-primary);
  
  @include respond-to(mobile) {
    display: block;
  }
}

// Mobile drawer styling
.mobile-drawer {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-24);
  transform: translateY(-150%);
  transition: transform 0.3s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 99;

  &.is-open {
    transform: translateY(0);
  }
}

.mobile-nav-link {
  display: block;
  padding: var(--space-12) 0;
  font-family: var(--font-code);
  font-size: 0.875rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mobile-overlay {
  display: none;
  
  @include respond-to(mobile) {
    &.is-active {
      display: block;
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 98;
    }
  }
}
</style>
