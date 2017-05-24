(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.GifStream = factory());
}(this, (function () { 'use strict';

function getUserMediaPolyfill(constraints) {
  var getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.msGetUserMedia;
  if (!getUserMedia) {
    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
  }
  return new Promise(function (resolve, reject) {
    getUserMedia.call(window.navigator, constraints, resolve, reject);
  });
}

var DEFAULT_IMAGE_SIZE = 100;
var IMAGE_QUALITY = 1.0;
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
function resizedVideostill(video) {
  var imageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_IMAGE_SIZE;
  var videoWidth = video.videoWidth;
  var videoHeight = video.videoHeight;
  if (!(videoWidth && videoHeight)) {
    return 'data:image/jpeg;base64,';
  }
  canvas.width = imageSize;
  canvas.height = imageSize;
  var ratio = videoWidth / videoHeight;
  var targetWidth = imageSize + imageSize / ratio / 2;
  var targetHeight = imageSize;
  var xPos = videoWidth > videoHeight ? -(imageSize / ratio / 4) : 0;
  var yPos = videoWidth <= videoHeight ? -(imageSize / ratio / 4) : 0;
  context.drawImage(video, xPos, yPos, targetWidth, targetHeight);
  return canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defaultOptions = {
  interval: 10000,
  imageSize: 100,
  callback: function callback() {}
};
var GifStream = function () {
  function GifStream(customOptions) {
    classCallCheck(this, GifStream);
    this.options = Object.assign({}, defaultOptions, customOptions);
    this.video = document.createElement('video');
    this.intervalTask = null;
  }
  createClass(GifStream, [{
    key: 'handleNext',
    value: function handleNext() {
      var imageData = resizedVideostill(this.video, this.options.imageSize);
      this.options.callback({
        imageData: imageData
      });
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;
      if (this.intervalTask) {
        return Promise.reject(new Error('Stream is already running'));
      }
      var constraints = {
        video: true,
        audio: false
      };
      return new Promise(function (resolve, reject) {
        getUserMediaPolyfill(constraints).then(function (stream) {
          try {
            _this.video.oncanplay = function () {
              _this.handleNext();
              _this.intervalTask = setInterval(function () {
                _this.handleNext();
              }, _this.options.interval);
            };
            _this.video.src = window.URL.createObjectURL(stream);
            _this.video.play();
            resolve();
          } catch (error) {
            reject(error);
          }
        }).catch(reject);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (!this.intervalTask) {
        return;
      }
      clearInterval(this.intervalTask);
      this.intervalTask = null;
    }
  }]);
  return GifStream;
}();

return GifStream;

})));
//# sourceMappingURL=gif-stream.js.map
