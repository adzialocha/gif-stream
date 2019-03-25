(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GifStream = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function getUserMediaPolyfill(constraints) {
    if (window.navigator.mediaDevices === undefined) {
      window.navigator.mediaDevices = {};
    }
    if (window.navigator.mediaDevices.getUserMedia !== undefined) {
      return window.navigator.mediaDevices.getUserMedia(constraints);
    }
    var getUserMedia = window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(window.navigator, constraints, resolve, reject);
    });
  }

  var DEFAULT_IMAGE_SIZE = 100;
  var IMAGE_QUALITY = 0.8;
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  function resizedVideostill(video) {
    var imageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_IMAGE_SIZE;
    var videoWidth = video.videoWidth,
        videoHeight = video.videoHeight;
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

  function request() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
    var url = arguments.length > 1 ? arguments[1] : undefined;
    var body = arguments.length > 2 ? arguments[2] : undefined;
    return window.fetch(url, {
      method: method,
      body: body
    }).then(function (response) {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }
  function signAndUploadFile(serverUrl, fileData, id) {
    request('GET', "".concat(serverUrl, "/api/upload?id=").concat(id)).then(function (response) {
      request('PUT', response.signedUrl, fileData);
    });
  }

  var defaultOptions = {
    callback: function callback() {},
    imageSize: 100,
    interval: 10000,
    serverUrl: 'http://localhost:3000'
  };
  function randomId() {
    return 9999999999999 - Date.now() + Math.random().toString(36).substr(2, 3);
  }
  var GifStream =
  function () {
    function GifStream(customOptions) {
      _classCallCheck(this, GifStream);
      this.options = Object.assign({}, defaultOptions, customOptions);
      this.video = document.createElement('video');
      this.stream = null;
      this.intervalTask = null;
      this.sessionId = '';
    }
    _createClass(GifStream, [{
      key: "handleNext",
      value: function handleNext() {
        var imageData = resizedVideostill(this.video, this.options.imageSize);
        signAndUploadFile(this.options.serverUrl, imageData, this.sessionId);
        this.options.callback({
          imageData: imageData
        });
      }
    }, {
      key: "start",
      value: function start() {
        var _this = this;
        if (this.intervalTask) {
          return Promise.resolve();
        }
        var constraints = {
          video: true,
          audio: false
        };
        return new Promise(function (resolve, reject) {
          getUserMediaPolyfill(constraints).then(function (stream) {
            _this.stream = stream;
            try {
              _this.video.oncanplay = function () {
                _this.sessionId = randomId();
                _this.intervalTask = setInterval(function () {
                  _this.handleNext();
                }, _this.options.interval);
              };
              _this.video.srcObject = _this.stream;
              _this.video.play();
              resolve();
            } catch (error) {
              reject(error);
            }
          }).catch(reject);
        });
      }
    }, {
      key: "stop",
      value: function stop() {
        if (!this.intervalTask) {
          return;
        }
        var track = this.stream.getTracks()[0];
        if (track) {
          track.stop();
        }
        clearInterval(this.intervalTask);
        this.intervalTask = null;
        this.sessionId = '';
      }
    }]);
    return GifStream;
  }();

  return GifStream;

}));
