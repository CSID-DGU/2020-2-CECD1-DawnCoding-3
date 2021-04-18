const proxy = require('http-proxy-middleware');

const toSpring = proxy({
  target: 'http://localhost:8000',
  changeOrigin: true,
});

module.exports = function (app) {
  app.use(
    '/tts', toSpring

  );
  app.use(
    '/devices', toSpring
  );
  app.use(
    '/stt',
    proxy({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};