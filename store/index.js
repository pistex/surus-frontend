
const actions = {
  nuxtServerInit ({ commit }, { $auth, $cookies }) {
    const accessToken = $cookies.get('auth._token.local')
    const isLoggedIn = $auth.loggedIn
    if (!accessToken & isLoggedIn) {
      $auth.logout()
      commit('authentication/logoutSuccess')
    }
  }
}

export default actions
