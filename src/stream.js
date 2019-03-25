import getUserMediaPolyfill from './utils/polyfill'
import resizedVideostill from './image'
import signAndUploadFile from './upload'

const defaultOptions = {
  callback: () => {},
  imageSize: 100,
  interval: 10000,
  serverUrl: 'http://localhost:3000',
}

function randomId() {
  return (9999999999999 - Date.now()) + Math.random().toString(36).substr(2, 3)
}

class GifStream {
  constructor(customOptions) {
    this.options = Object.assign({}, defaultOptions, customOptions)
    this.video = document.createElement('video')

    this.stream = null
    this.intervalTask = null
    this.sessionId = ''
  }

  handleNext() {
    const imageData = resizedVideostill(this.video, this.options.imageSize)
    signAndUploadFile(this.options.serverUrl, imageData, this.sessionId)

    this.options.callback({
      imageData,
    })
  }

  start() {
    if (this.intervalTask) {
      return Promise.resolve()
    }

    const constraints = {
      video: true,
      audio: false,
    }

    return new Promise((resolve, reject) => {
      getUserMediaPolyfill(constraints)
        .then((stream) => {
          this.stream = stream

          try {
            this.video.oncanplay = () => {
              this.sessionId = randomId()
              this.intervalTask = setInterval(() => {
                this.handleNext()
              }, this.options.interval)
            }

            this.video.srcObject = this.stream
            this.video.play()

            resolve()
          } catch (error) {
            reject(error)
          }
        })
        .catch(reject)
    })
  }

  stop() {
    if (!this.intervalTask) {
      return
    }

    const track = this.stream.getTracks()[0]
    if (track) {
      track.stop()
    }

    clearInterval(this.intervalTask)
    this.intervalTask = null
    this.sessionId = ''
  }
}

export default GifStream
