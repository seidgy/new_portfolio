// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/i18n',
    '@vueuse/motion/nuxt'
  ],

  css: [
    '~/assets/scss/main.scss'
  ],

  app: {
    head: {
      title: 'Seidgy Amano | Product Consultant',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'title', content: 'Seidgy Amano | Product Consultant & UX Engineer' },
        { name: 'description', content: 'Product Consultant combining systems-thinking with deep craft in design, UX research, strategy, and engineering to build high-impact digital products.' },
        { name: 'og:title', content: 'Seidgy Amano | Product Consultant & UX Engineer' },
        { name: 'og:description', content: 'Product Consultant combining systems-thinking with deep craft in design, UX research, strategy, and engineering to build high-impact digital products.' },
        { name: 'og:image', content: '/images/og-share.jpg' },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: 'https://amano.solutions/' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/images/og-share.jpg' },
        { name: 'twitter:title', content: 'Seidgy Amano | Product Consultant & UX Engineer' },
        { name: 'twitter:description', content: 'Product Consultant combining systems-thinking with deep craft in design, UX research, strategy, and engineering to build high-impact digital products.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;800;900&family=JetBrains+Mono:wght@400;500&display=swap' }
      ]
    }
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'pt', name: 'Português', language: 'pt-BR' },
      { code: 'en', name: 'English', language: 'en-US' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default'
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;'
        }
      }
    }
  }
})
