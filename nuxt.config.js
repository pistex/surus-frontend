export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - surus-frontend',
    title: 'surus-frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxt/content',
    '@nuxtjs/auth'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'http://localhost:8000'
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  auth: {
    localStorage: false,
    strategies: {
      local: {
        endpoints: {
          login: { url: '/authentication/login/', method: 'post', propertyName: false },
          logout: { url: '/authentication/logout/', method: 'post', propertyName: false },
          user: { url: '/user_profile/', method: 'get', propertyName: false }
        }
      }
    },
    tokenType: 'Bearer',
    plugins: [{ src: '~/plugins/auth.js', mode: 'client' }]
  },
  middleware: ['loggedIn']
}
