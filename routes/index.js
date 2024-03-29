var express = require('express');
var router = express.Router();

var xml = require('./xml')
var scrap = require('./scrap')
var data = require('./data')

var lotteryusa_scrap = require('./lotteryusa/scrap')
var lotteryusa_data = require('./lotteryusa/data')
var lotteryusa_xml = require('./lotteryusa/xml')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/xml', xml);
router.use('/scrap', scrap);
router.use('/data', data);

/*lottery usa*/
router.use('/lotteryusa/scrap', lotteryusa_scrap)
router.use('/lotteryusa/data', lotteryusa_data)
router.use('/lotteryusa/xml', lotteryusa_xml)

module.exports = router;
