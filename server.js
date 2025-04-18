const { createServer } = require("https");

// const express = require("express");
// const cors = require("cors");
// const server = express();
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("cert/customer.key"),
  cert: fs.readFileSync("cert/customer.crt"),
  ca: fs.readFileSync("cert/customer.ca.cert")
};

/* app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
   
    const parsedUrl = parse(req.url, true);
   
    handle(req, res, parsedUrl);
  }).listen("3000", "3.80.48.58", (err) => {
    if (err) throw err;
  });
}); */


app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {   
    const parsedUrl = parse(req.url, true);   
    handle(req, res, parsedUrl);
  }).listen("3000", (err) => {
    console.log("listening on 1 *:3000" );
    if (err) throw err;
  });
});

