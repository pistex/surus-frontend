import { requestHeader } from '../helpers/request-header'
import Axios from '../axios'
export const authenticationService = {
  postLogin,
  postLogout,
  postRegister,
  postPasswordReset,
  postResetPassword
}

// the fucntion return userData object included profile and authentication data.
async function postLogin (username, password) {
  const loginData = {
    username,
    password
  }
  try {
    const loginResponse = await Axios.post('/authentication/login/', loginData)
    if (loginResponse.data.access_token && loginResponse.data.refresh_token && loginResponse.data.user.pk) {
      const profileResponse = await Axios.get('/user_profile/' + loginResponse.data.user.pk + ' /')
      const userData = {
        ...profileResponse.data,
        token: {
          access: loginResponse.data.access_token,
          refresh: loginResponse.data.refresh_token
        }
      }
      localStorage.setItem('userData', JSON.stringify(userData))
      return userData
    } else {
      alert('No authetication verification replied.')
    }
  } catch (error) {
    throw new Error(error)
  }
}

// the fucntion return logout status
async function postLogout () {
  const config = { headers: await requestHeader() }
  try {
    const response = await Axios.post(
      '/authentication/logout/',
      null,
      config)
    localStorage.removeItem('userData')
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

// the fucntion return userData object included profile and authentication data.
async function postRegister (username, email, password1, password2) {
  const registerData = {
    username,
    email,
    password1,
    password2
  }
  try {
    const registrationResponse = await Axios.post(
      '/authentication/registration/',
      registerData)
    const profileResponse = await Axios.get('/user_profile/' + registrationResponse.data.user.pk + ' /')
    const userData = {
      ...profileResponse.data,
      token: {
        access: registrationResponse.data.access_token,
        refresh: registrationResponse.data.refresh_token
      }
    }
    // log user in after registeration
    localStorage.setItem('userData', JSON.stringify(userData))
    return userData
  } catch (error) {
    throw new Error(error)
  }
}

async function postPasswordReset (email) {
  const config = { headers: await requestHeader() }
  try {
    const response = await Axios.post(
      '/authentication/password/reset/', { email }, config)
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}
async function postResetPassword (uid, token, newPassword1, newPassword2) {
  const config = { headers: await requestHeader() }
  const resetData = {
    uid,
    token,
    new_password1: newPassword1,
    new_password2: newPassword2
  }
  try {
    const response = await Axios.post(
      '/authentication/password/reset/confirm/ ',
      resetData, config)
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}
