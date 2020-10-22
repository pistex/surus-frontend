export default function smallScreenWarning () {
  if (process.client) {
    alert('WARNING: This page is not optimized for small screen resolution.')
  }
}
