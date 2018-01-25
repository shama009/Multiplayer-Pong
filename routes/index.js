var express = require('express');
var router = express.Router();

const {
  Score_2P
} = require('../models');

// GET route for getting all of the posts
router.get("/api/scores", function (req, res) {
  Score_2P.findAll({}).then(scores => { // {order: ...}
    res.json(scores); // json or render?
  });
});

module.exports = router;