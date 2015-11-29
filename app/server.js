var express = require('express');

var app = module.exports = express();

app.use(express.static('dist'));

app.use('/redirect', function(req, res, next){
  req.url = '/#' + req.url;
  next();
});

var port = process.env.PORT || 8001;

app.listen(port, function(){
  console.log("Listening on port " + port);
});
