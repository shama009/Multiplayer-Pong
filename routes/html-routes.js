var path = require("path");
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render(__dirname + '/../views/index.ejs');
});

router.get("/scoreboard", function(req, res) {
  res.render(__dirname + "/../views/scoreboard.ejs"); // got rid of ..
});

module.exports = router;
