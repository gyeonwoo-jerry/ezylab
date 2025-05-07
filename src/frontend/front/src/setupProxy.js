const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const apiUrl = "http://211.110.44.79:48080"; // 기본 포트 설정

  app.use(
      "/api", // /api로 시작하는 모든 요청을 백엔드 서버로 프록시
      createProxyMiddleware({
        target: apiUrl,
        changeOrigin: true, // CORS 우회용
        pathRewrite: {
          '^/api': '', // `/api`를 타겟 서버에 맞게 경로를 수정하려면 여기를 추가할 수 있음
        },
      })
  );
};
