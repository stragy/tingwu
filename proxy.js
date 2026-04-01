const http = require('http');

const targetPort = 3001;

const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(8080, () => {
  console.log('Proxy server running on port 8080 -> localhost:3001');
});
