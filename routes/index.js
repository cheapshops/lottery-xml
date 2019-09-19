var express = require('express');
var router = express.Router();

var xml = require('./xml')
var scrap = require('./scrap')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/xml', xml);
router.use('/scrap', scrap);

module.exports = router;
