const DEFAULT_IMAGE_SIZE = 100
const IMAGE_QUALITY = 0.8

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

export default function resizedVideostill(video, imageSize = DEFAULT_IMAGE_SIZE) {
  const { videoWidth, videoHeight } = video

  if (!(videoWidth && videoHeight)) {
    return 'data:image/jpeg;base64,'
  }

  canvas.width = imageSize
  canvas.height = imageSize

  const ratio = videoWidth / videoHeight
  const targetWidth = imageSize + (imageSize / ratio / 2)
  const targetHeight = imageSize
  const xPos = videoWidth > videoHeight ? -(imageSize / ratio / 4) : 0
  const yPos = videoWidth <= videoHeight ? -(imageSize / ratio / 4) : 0

  context.drawImage(video, xPos, yPos, targetWidth, targetHeight)

  return canvas.toDataURL('image/jpeg', IMAGE_QUALITY)
}
