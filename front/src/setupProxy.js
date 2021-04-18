const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/tts',
    proxy({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
  app.use(
    '/stt',
    proxy({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};