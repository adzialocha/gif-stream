export default function getUserMediaPolyfill(constraints) {
  if (window.navigator.mediaDevices === undefined) {
    window.navigator.mediaDevices = {}
  }

  if (window.navigator.mediaDevices.getUserMedia !== undefined) {
    return window.navigator.mediaDevices.getUserMedia(constraints)
  }

  const getUserMedia = (
    window.navigator.webkitGetUserMedia
    || window.navigator.mozGetUserMedia
  )

  if (!getUserMedia) {
    return Promise.reject(
      new Error('getUserMedia is not implemented in this browser')
    )
  }

  return new Promise((resolve, reject) => {
    getUserMedia.call(window.navigator, constraints, resolve, reject)
  })
}
