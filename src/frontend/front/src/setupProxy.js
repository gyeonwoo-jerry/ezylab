const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://211.110.44.79:48080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      })
  );
};
