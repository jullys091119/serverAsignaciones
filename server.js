const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware para manejar CORS
  server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // Proxy API
  server.use(
    '/api',
    createProxyMiddleware({
      target: 'https://elalfaylaomega.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Reescribe la ruta para apuntar a la raíz del servidor de destino
      },
      onProxyRes: (proxyRes, req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      },
    })
  );

  // Manejo de rutas estáticas y dinámicas
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Configura el puerto para el servidor
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
