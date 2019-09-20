var express = require('express');
var router = express.Router();
var xml = require('xml');
const model = require('../models/index');

router.get('/', function(req, res, next) {
    model.Results.find(function(err, results){
        let xmlData = [];

        results.map(function(data,key){
            row = {
                game: [
                    {
                        lastdraw_date: data.dateText
                    },
                    {
                        lastdraw_number: data.dateText
                    }
                ]
            }
            xmlData.push(row)
        })
        // res.set('Content-Type', 'text/xml');
        res.type('application/xml');
        res.send(xml(xmlData));
        // res.json(results);
    }).sort({createdAt: -1}).limit(10)
});

module.exports = router;
