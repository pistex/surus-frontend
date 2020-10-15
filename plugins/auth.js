import jwtDecode from 'jwt-decode'
const strategy = 'local'
const FALLBACK_INTERVAL = 4 * 60 * 1000 * 0.75
async function tokenRefresher ($auth, $router, $axios, accessToken, refreshToken) {
  if (accessToken && refreshToken) {
    try {
      const response = await $axios.post('/authentication/token/refresh/', {
        refresh: refreshToken
      })
      accessToken = response.data.access
      $auth.setToken(strategy, `Bearer ${accessToken}`)
      $axios.setHeader('Authorization', 'Bearer ' + accessToken)
      const decodedToken = jwtDecode(accessToken)
      return decodedToken.exp
    } catch (error) {
      $auth.logout()
      alert('Authentication token is expired. The user has been automatically logged out.')
      $router.push('/')
      throw new Error(error)
    }
  } else {
    throw new Error('There is an error while refreshing token. You can ignore this error if no user is logged in.')
  }
}

export default async function ({ app }) {
  const { $axios, $auth, $router } = app

  let accessToken = $auth.getToken(strategy)
  let refreshToken = $auth.getRefreshToken(strategy)
  let refreshInterval = FALLBACK_INTERVAL

  if (accessToken && refreshToken) {
    const decodedToken = jwtDecode(accessToken)
    refreshInterval = (decodedToken.exp * 1000 - Date.now()) * 0.75

    if (refreshInterval < 10000 && refreshInterval > 0) {
      // minimum refresh interval: 10 seconds.
      refreshInterval = 10000
    }
    if (refreshInterval < 0) {
      // this means the access token is expired.
      refreshInterval = (await tokenRefresher($auth, $router, $axios, accessToken, refreshToken) * 1000 - Date.now()) * 0.75
    }
  }

  const tokenRefreshInterval = setInterval(async function () {
    try {
      accessToken = $auth.getToken(strategy)
      refreshToken = $auth.getRefreshToken(strategy)
      await tokenRefresher($auth, $router, $axios, accessToken, refreshToken)
    } catch (error) {
      clearInterval(tokenRefreshInterval)
      throw new Error(error)
    }
  }, refreshInterval)
}
