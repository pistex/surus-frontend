import Vue from 'vue'
import Vuex from 'vuex'
import { authenticationStore } from './modules/authentication'
import { blogStore } from './modules/blog'
import { adminPanel } from './modules/admin'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    nuxtServerInit ({ commit }, { $auth, $cookies }) {
      const accessToken = $cookies.get('auth._token.local')
      if (!accessToken) {
        $auth.logout()
        commit('authenticationStore/logoutSuccess')
      }
    }
  },
  modules: {
    authenticationStore,
    blogStore,
    adminPanel
  }
})

export default function () {
  return vuex
}
