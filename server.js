const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

// const express = require("express");
// const cors = require("cors");
// const server = express();

// Create the Next.js app
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// HTTPS configuration with existing certificates
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "cert", "uniride.frontend-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert", "uniride.frontend.pem"))
};

/* app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
   
    const parsedUrl = parse(req.url, true);
   
    handle(req, res, parsedUrl);
  }).listen("3000", "3.80.48.58", (err) => {
    if (err) throw err;
  });
}); */

// Prepare and start the HTTPS server
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3002, (err) => {
    if (err) throw err;
    console.log('> Ready on https://uniride.frontend:3000');
    console.log('> HTTPS server running with custom certificates');
  });
});

