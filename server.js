const express = require('express')
const app = express()
var path = require('path');

app.use(express.static(__dirname));

app.get('/', function (req, res) {

  res.sendFile(path.join(__dirname+'/index.html'));

});







let port = 3000;

app.listen(port, function () {
  console.log('Listening on port:', port);
});