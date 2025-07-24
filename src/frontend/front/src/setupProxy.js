const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://211.110.44.28:8580",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      onProxyReq: (proxyReq, req, res) => {
        console.log("프록시 요청:", req.method, req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log("프록시 응답:", proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error("프록시 오류:", err);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("프록시 서버 연결 오류: " + err.message);
      },
    })
  );
};
