export default function errorResponseAlert (error) {
  if (error.response) {
    const responseStatus = error.response.status
    if (responseStatus === 400) {
      alert('Invalid data is sent to server. Please try agian.')
    } else if (responseStatus === 401) {
      alert('Authorization failed. The authenticated user is not allowed to perform this action or the request is made by anonymous user.')
    } else if (responseStatus === 403) {
      alert('Permission failed. This action is not allowed.')
    } else if (responseStatus === 404) {
      alert('Requested url not found. Please report the issue to admin.')
    } else if (responseStatus === 500) {
      alert('Internal server error. Please report the issue to admin.')
    }
  }
}
