var express = require('express');
var url = require("url");
const score = require('../lib/score.js');

var router = express.Router();

/* GET api root */
router.get('/', function (req, res, next) {
  res.send('This is the api root. Not much to see here. Try score or explain.');
});

/* GET a hand's score */
router.get('/score', function (req, res, next) {
  var q = url.parse(req.originalUrl, true);
  var query = q.query;
  var hand = query.hand;
  var isCrib = query.isCrib;

  isCrib = (isCrib === 'true'); 

  try {
    var s = score.scoreHand(hand, isCrib);
    res.send(s.toString());
  }
  catch (err) {
    return res.status(400).end(err);
  }
});

/* GET a hand's score and an explanation of the points */
router.get('/explain', function (req, res, next) {
  res.send("21 - that's a lot");
});

module.exports = router;
