import Axios from '../axios'
export async function requestHeader () {
  const userData = JSON.parse(localStorage.getItem('userData'))
  if (userData && userData.token) {
    let headers = {
      Authorization: 'Bearer ' + userData.token.access
    }
    let tokenIsStillValid = null
    try {
      await Axios.post('/authentication/token/verify/', {
        token: userData.token.access
      })
      tokenIsStillValid = true
    } catch (error) {
      tokenIsStillValid = false
    }
    if (tokenIsStillValid) {
      return headers
    }

    try {
      const response = await Axios.post('/authentication/token/refresh/', {
        refresh: userData.token.refresh
      })
      userData.token.access = response.data.access
    } catch (error) {
      localStorage.removeItem('userData')
      alert('Authentication token is expired. The user has been automatically logged out.')
      this.$router.push('/')
      location.reload()
    }

    headers = {
      Authorization: 'Bearer ' + userData.token.access
    }
    localStorage.setItem('userData', JSON.stringify(userData))
    return headers
  } else {
    return {}
  }
}
