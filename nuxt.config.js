import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = require('path').resolve(__dirname, '.secret/credential.json')
}
const secretManagerClient = new SecretManagerServiceClient()
async function accessSecret (name) {
  const [accessResponse] = await secretManagerClient.accessSecretVersion({ name })
  const responsePayload = accessResponse.payload.data.toString('utf8')
  return responsePayload
}

export default async function () {
  return {
    env: {
      CLOUD_STORAGE_ROOT: await accessSecret('projects/808537418853/secrets/CLOUD_STORAGE_ROOT/versions/1')
    },
    head: {
      titleTemplate: '%s - S U R U S',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },

    components: true,

    buildModules: [
      '@nuxtjs/eslint-module',
      '@nuxtjs/vuetify'
    ],

    modules: [
      '@nuxtjs/axios',
      '@nuxtjs/auth',
      '@nuxtjs/recaptcha',
      '@nuxtjs/firebase',
      'cookie-universal-nuxt'
    ],

    recaptcha: {
      siteKey: await accessSecret('projects/808537418853/secrets/RECAPTCHA_SITE_KEY/versions/1'),
      size: 'invisible',
      hideBadge: true,
      version: 2
    },

    firebase: {
      config: {
        apiKey: await accessSecret('projects/808537418853/secrets/FIREBASE_API_KEY/versions/1'),
        authDomain: 'surus-d6101.firebaseapp.com',
        projectId: 'surus-d6101',
        appId: '1:808537418853:web:cf5508484a481d71752a8c',
        measurementId: 'G-9ECFE8J2Z9'
      },
      services: {
        auth: true,
        analytics: true
      }
    },

    axios: {
      baseURL: await accessSecret('projects/808537418853/secrets/API_BASE_URL/versions/1')
    },

    build: {
      transpile: ['tiptap.js', 'tiptap-extentions.js', 'highlight.js', 'vue-clipboard2']
    },
    auth: {
      redirect: { logout: false },
      localStorage: false,
      strategies: {
        local: {
          endpoints: {
            login: { url: '/authentication/login/', method: 'post', propertyName: false },
            logout: false,
            user: { url: '/user_profile/', method: 'get', propertyName: false }
          },
          tokenName: 'backend-authorization'
        }
      },
      plugins: [{ src: '@/plugins/auth.js', mode: 'client' }]
    },
    plugins: [
      { src: '@/plugins/tiptap.js', mode: 'client' },
      { src: '@/plugins/tiptap-extensions.js', mode: 'client' },
      { src: '@/plugins/highlight.js', mode: 'client' },
      { src: '@/plugins/vue-clipboard2.js', mode: 'client' }
    ],
    middleware: ['loggedIn']
  }
}
