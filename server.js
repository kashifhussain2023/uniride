const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Create the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// HTTPS configuration with existing certificates
const httpsOptions = {
  // Correct key
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'uniride.frontend.pem')),
  key: fs.readFileSync(path.join(__dirname, 'certs', 'uniride.frontend-key.pem')), // Correct cert
};

// Prepare and start the HTTPS server
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on https://uniride.frontend:3000');
    console.log('> HTTPS server running with custom certificates');
  });
});
