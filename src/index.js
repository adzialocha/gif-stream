import getUserMediaPolyfill from './utils/polyfill'
import resizedVideostill from './screenshot'

const defaultOptions = {
  interval: 10000,
  imageSize: 100,
  callback: () => {},
}

class GifStream {
  constructor(customOptions) {
    this.options = Object.assign({}, defaultOptions, customOptions)
    this.video = document.createElement('video')
    this.intervalTask = null
  }

  handleNext() {
    const imageData = resizedVideostill(this.video, this.options.imageSize)

    this.options.callback({
      imageData,
    })
  }

  start() {
    if (this.intervalTask) {
      return Promise.reject(new Error('Stream is already running'))
    }

    const constraints = {
      video: true,
      audio: false,
    }

    return new Promise((resolve, reject) => {
      getUserMediaPolyfill(constraints)
        .then((stream) => {
          try {
            this.video.oncanplay = () => {
              this.handleNext()

              this.intervalTask = setInterval(() => {
                this.handleNext()
              }, this.options.interval)
            }
            this.video.src = window.URL.createObjectURL(stream)
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

    clearInterval(this.intervalTask)
    this.intervalTask = null
  }
}

export default GifStream
