import Vue from 'vue'
import Vuex from 'vuex'
import { authenticationStore } from './modules/authentication'
import { blogStore } from './modules/blog'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
  modules: {
    authenticationStore,
    blogStore
  }
})

export default function () {
  return vuex
}
