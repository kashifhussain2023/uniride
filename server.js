const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Create the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare and start the HTTP server
app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(4005, err => {
    if (err) throw err;
    console.log('> Ready on https://uniride.frontend:3000');
    console.log('> HTTPS server running with custom certificates');
  });
});
