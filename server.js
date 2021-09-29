const path = require('path');
const express = require('express');
// const fileUpload = require("express-fileupload");
const fs = require('fs')
const url = require('url');
// const formidable = require("formidable");

const api = require('./api/api.js');
const { ppid } = require('process');

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(fileUpload({ createParentPath: true }))

app.get("/test", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream(__dirname + "/api/test.html").pipe(res);
});

app.use('/api', api);
// app.use(app.router);
// routes.initialize(app);

const port = 5001;
const server = app.listen(port, () =>
  console.log("Server listening on port " + port)
);
