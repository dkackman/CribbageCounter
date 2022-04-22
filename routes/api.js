const express = require('express');
const url = require("url");
const cribbageCounter = require('cribbage-counter');

const router = express.Router();

/* GET api root */
router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send('This is the api root. Not much to see here. Try score or explain.');
});

/* GET a hand's score */
router.get('/score', function (req, res, next) {
  try {
    const o = getScore(req);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(o.score.toString());
  }
  catch (err) {
    return res.status(500).end("an error occured");
  }
});

/* GET a hand's score and an explanation of the points */
router.get('/explain', function (req, res, next) {
  try {
    const o = getScore(req);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(o));
  }
  catch (err) {
    return res.status(500).end("an error occurred");
  }
});

function getScore(req) {
  const q = url.parse(req.originalUrl, true);
  const query = q.query;

  return cribbageCounter.scoreHand(query.hand, query.isCrib.toLowerCase() === 'true');
}

module.exports = router;
