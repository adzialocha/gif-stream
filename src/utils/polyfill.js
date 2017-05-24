export default function getUserMediaPolyfill(constraints) {
  const getUserMedia = (window.navigator.getUserMedia ||
      window.navigator.webkitGetUserMedia ||
      window.navigator.mozGetUserMedia ||
      window.navigator.msGetUserMedia)

  if (!getUserMedia) {
    return Promise.reject(
      new Error('getUserMedia is not implemented in this browser')
    )
  }

  return new Promise((resolve, reject) => {
    getUserMedia.call(window.navigator, constraints, resolve, reject)
  })
}
