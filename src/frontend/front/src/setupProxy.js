const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://211.110.44.79:48080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api' // API 경로를 명확히 지정
        },
        onError: (err, req, res) => {
          console.error('프록시 오류:', err);
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end('프록시 서버 연결 오류');
        }
      })
  );
};