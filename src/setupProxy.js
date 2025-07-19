const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.twocents.money',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding to target
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log the proxy request for debugging
        console.log('🔄 PROXY: Forwarding request to:', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log the proxy response for debugging
        console.log('🔄 PROXY: Received response with status:', proxyRes.statusCode);
      },
      onError: (err, req, res) => {
        // Log proxy errors
        console.log('❌ PROXY ERROR:', err.message);
      }
    })
  );
}; 