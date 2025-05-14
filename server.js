const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

// Create the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  ca: fs.readFileSync('certs/ca_25.cert'),
  cert: fs.readFileSync('certs/ssl_25.cert'),
  key: fs.readFileSync('certs/ssl_25.key'),
  // Increase max header size to 32KB (32 * 1024)
  maxHeaderSize: 32 * 1024,
};

app.prepare().then(() => {
  const server = createServer(httpsOptions, (req, res) => {
    // Increase header size limits
    if (!req.maxHeadersCount) {
      req.maxHeadersCount = 100;
    }

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.timeout = 300000;
  server.keepAliveTimeout = 60000;
  server.headersTimeout = 65000;

  server.listen('4005', '0.0.0.0', err => {
    if (err) throw err;
  });
});
