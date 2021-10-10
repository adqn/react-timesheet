const path = require('path');
const express = require('express');
const cors = require('cors')
// const fileUpload = require("express-fileupload");
const fs = require('fs')
const url = require('url');
// const formidable = require("formidable");

const api = require('./api/api.js');
const { ppid } = require('process');

const app = express();

// app.use(cors())
app.use(cors({ origin: 'http://localhost:3000' , credentials :  true }))
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
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
