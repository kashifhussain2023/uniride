const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Create the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// HTTPS configuration with mkcert certificates
const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost+2.pem')),
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost+2-key.pem')),
};

// Prepare and start the HTTPS server
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
    console.log('> HTTPS server running with mkcert certificates');
  });
});
