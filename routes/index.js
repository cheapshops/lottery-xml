var express = require('express');
var router = express.Router();

var xml = require('./xml')
var scrap = require('./scrap')
var data = require('./data')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/xml', xml);
router.use('/scrap', scrap);
router.use('/data', data);

module.exports = router;
