import { authenticationService } from '../../services/authentication'

let userData = null
if (process.browser) {
  userData = JSON.parse(localStorage.getItem('userData'))
}

export const authenticationStore = {
  namespaced: true,
  state: userData ? { status: { loggedIn: true }, userData } : { status: { loggedIn: false }, userData: null },
  getters: {
    status (state) {
      return state.status
    },
    userData (state) {
      return state.userData
    }
  },
  actions: {
    postLogin ({ commit }, { username, password }) {
      commit('loginRequested', { username })
      try {
        userData = authenticationService.postLogin(username, password)
        commit('loginSuccess', userData)
      } catch (error) {
        commit('loginFailure', error)
        throw new Error(error)
      }
    },
    postLogout ({ commit }) {
      authenticationService.postLogout()
      commit('logoutRequested')
    }
  },
  mutations: {
    loginRequested (state, username) {
      state.status = { loggingIn: true }
      state.userData = { user: { username } }
    },
    loginSuccess (state, userData) {
      state.status = { loggedIn: true }
      state.userData = userData
    },
    loginFailure (state) {
      state.status = {}
      state.userData = null
    },
    logoutRequested (state) {
      state.status = { loggedIn: false }
      state.userData = null
    }
  }
}
