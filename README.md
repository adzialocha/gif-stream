gif-stream
======

## Example

```
<div id="image-container"></div>
<button id="start">Start</button>
<button id="stop">Stop</button>
<script type="text/javascript" src="lib/gif-stream.min.js"></script>
<script type="text/javascript">
  const container = document.getElementById('image-container')
  const startButton = document.getElementById('start')
  const stopButton = document.getElementById('stop')

  const options = {
    callback: (data) => {
      const image = document.createElement('img')
      image.setAttribute('src', data.imageData)
      container.appendChild(image)
    },
    interval: 2500,
    serverUrl: 'https://hoffnung3000-gif-stream.herokuapp.com',
  }

  const stream = new GifStream(options)

  function enableStart() {
    startButton.disabled = false
    stopButton.disabled = true
  }

  function enableStop() {
    startButton.disabled = true
    stopButton.disabled = false
  }

  function start() {
    stream.start()
      .then(() => {
        enableStop()
      })
      .catch((err) => {
        window.alert('An error occurred.')
        enableStart()
      })
  }

  function stop() {
    stream.stop()
    enableStart()
  }

  startButton.addEventListener('click', start)
  stopButton.addEventListener('click', stop)

  enableStart()
</script>
```
