const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const pathToStaticFile = path.join(__dirname, "page");
const indexHTML = path.join(__dirname, "page", "index.html");
app.use(express.static(pathToStaticFile));
app.get("/", function(req, res) 
{
  res.senFile(indexHTML)
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
