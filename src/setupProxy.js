const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.twocents.money/prod',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to target
      },
      onProxyReq: (proxyReq, req, res) => {
        // Proxy request logging disabled
      },
      onProxyRes: (proxyRes, req, res) => {
        // Proxy response logging disabled
      },
      onError: (err, req, res) => {
        // Proxy error logging disabled
      }
    })
  );
}; 