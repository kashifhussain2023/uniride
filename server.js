const { createServer } = require('http');
const { createServer: createHttpsServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Create the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

console.log(process.env.NODE_ENV);
// Prepare and start the server
app.prepare().then(() => {
  if (dev) {
    // Development mode - use HTTPS with mkcert certificates
    const httpsOptions = {
      cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem')),
      key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
    };

    createHttpsServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on https://localhost:3000');
    });
  } else {
    // Production mode - use HTTP
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(4005, err => {
      if (err) throw err;
      console.log('> Ready on http://unirideus-rebranding.24livehost.com:4005');
    });
  }
});
