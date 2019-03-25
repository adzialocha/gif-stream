gif-stream
===

Simple client to take, resize and upload single images to `gif-stream-server`. Go to https://github.com/adzialocha/gif-stream-server for server-side code.

## Example

![A gif-stream example](https://raw.githubusercontent.com/adzialocha/gif-stream/master/example.gif)

## Usage

```html
<div id="image-container"></div>
<button id="start">Start</button>
<button id="stop">Stop</button>

<script type="text/javascript" src="lib/index.js"></script>
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
    serverUrl: 'https://your-gif-stream-server.herokuapp.com',
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
