// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable Nuxt 4 compatibility and directory structure
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  // GSAP often needs to be transpile if using some plugins, but core is fine.
  build: {
    transpile: ['gsap'],
  },

  nitro: {
    // Explicitly using node-server for stability on Windows if Bun protocols leak
    preset: 'node-server',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'КайдзюДроп | Премиум Аниме-Мерч',
      meta: [
        { name: 'description', content: 'Премиальные аниме-фигурки, уличная одежда и аксессуары. Лучший дроп для настоящих отаку.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
});

