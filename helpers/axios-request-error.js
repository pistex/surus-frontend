export default function errorResponseAlert (error) {
  if (process.client) {
    if (error.response) {
      const responseStatus = error.response.status
      if (error.response.data.detail) {
        alert(error.response.data.detail)
      } else if (responseStatus === 400) {
        alert('Invalid data is sent to server. Please try again.')
      } else if (responseStatus === 401) {
        alert('Authorization failed. The authenticated user is not allowed to perform this action or the request is made by anonymous user.')
      } else if (responseStatus === 403) {
        alert('Permission failed. This action is not allowed.')
      } else if (responseStatus === 404) {
        alert('Requested url not found. Please report the issue to admin.')
      } else if (responseStatus === 405) {
        alert('Requested method is not allow. Please report the issue to admin.')
      } else if (responseStatus === 500) {
        alert('Internal server error. Please report the issue to admin.')
      }
    }
  } else {
    alert(error)
    throw new Error(error)
  }
}
