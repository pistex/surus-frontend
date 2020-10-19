import errorResponseAlert from '@/helpers/axios-request-error'
export const authenticationStore = {
  namespaced: true,
  state: { authenticationStatus: 'No user logged in.' },
  getters: {
    authenticationStatus (state) {
      return state.authenticationStatus
    }
  },
  actions: {
    async postLogin ({ commit }, { username, password }) {
      commit('loginRequested', { username })
      try {
        const loginResponse = await this.$axios.post('/authentication/login/', { username, password })
        if (loginResponse.data.access_token && loginResponse.data.refresh_token && loginResponse.data.user.pk) {
          const userData = {
            token: {
              access: loginResponse.data.access_token,
              refresh: loginResponse.data.refresh_token
            }
          }
          commit('setToken', userData.token)
          commit('setHeader', userData.token)
          const profileResponse = await this.$axios.get('/user_profile/' + loginResponse.data.user.pk + ' /')
          commit('loginSuccess', profileResponse.data)
        } else {
          alert('No authentication respone')
        }
      } catch (error) {
        errorResponseAlert(error)
        commit('loginFailure', error)
      }
    },
    async postLogout ({ commit }) {
      try {
        await this.$axios.post('/authentication/logout/')
        delete this.$axios.defaults.headers.common.Authorization
        commit('logoutSuccess')
      } catch (error) {
        errorResponseAlert(error)
      }
    }
  },
  mutations: {
    loginRequested (state, username) {
      state.authenticationStatus = `The user ${username} is logging in.`
    },
    setToken (state, token) {
      this.$auth.setToken('local', `Bearer ${token.access}`)
      this.$auth.setRefreshToken('local', token.refresh)
      state.authenticationStatus = 'Tokens are set.'
    },
    setHeader (state, token) {
      this.$axios.setToken(token.access, 'Bearer')
      state.authenticationStatus = 'Axios header is set.'
    },
    loginSuccess (state, userData) {
      this.$auth.setUser(userData)
      state.authenticationStatus = 'A user is logged in.'
    },
    loginFailure (state, error) {
      state.authenticationStatus = `Logging in error with status: ${error.response.status}.`
    },
    logoutSuccess (state) {
      state.authenticationStatus = 'No user logged in.'
      this.$auth.logout()
    }
  }
}
