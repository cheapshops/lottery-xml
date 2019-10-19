var express = require('express');
var router = express.Router();
const model = require('../../models/index');

router.get('/', function(req, res, next) {
    model.ResultsLotteryUsa.find(function(err, results){
        res.json(results);
    }).sort({createdAt: -1}).limit(100)
});

module.exports = router;
