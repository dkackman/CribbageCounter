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
  try {
    var o = getScore(req);
    res.send(o.score.toString());
  }
  catch (err) {
    return res.status(400).end(err);
  }
});

/* GET a hand's score and an explanation of the points */
router.get('/explain', function (req, res, next) {
  try {
    var o = getScore(req);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(o));
  }
  catch (err) {
    return res.status(400).end(err);
  }
});

function getScore(req)
{
  var q = url.parse(req.originalUrl, true);
  var query = q.query;
  var hand = query.hand;
  var isCrib = query.isCrib;

  return score.scoreHand(hand, isCrib === 'true');
}

module.exports = router;
