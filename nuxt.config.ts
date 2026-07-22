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
        { name: 'description', content: 'Portfólio de Seidgy Amano. Combinação de pesquisa, estratégia, design e engenharia.' }
      ],
      link: [
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
