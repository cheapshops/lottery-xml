var express = require('express');
var router = express.Router();
const model = require('../models/index');
const service = require('../service')

async function saveRecord(data,callback){
  if( data.length ==  0 ){
    callback('all data processed for DB insert/update .....');
  }else{
    console.log( data.length);
    rec = data[0];
    data.splice(0, 1); //remove first product
    let checkExist = await model.Results.count({
        location: rec.location,
        gameName: rec.gameName,
        dateText: rec.dateText
    })
    console.log("checkExist record :: " + checkExist)
    if( checkExist == 0 ){
        console.log('-----NEW RECORD INSRTED----')
        console.log(rec)
        await model.Results.create(rec)
    }
    saveRecord(data, callback)
  }
}

function scrap_pages( urls, callback ){
    console.log('****************************************')
  console.log( 'Pending urls to scrap :: ' + urls.length );
  console.log('****************************************')
  if( urls.length == 0 ){
    callback();
  }else{
    var urlToScrap = urls[0]['url'];
    var urlLocation = urls[0]['location'];
    urls.splice(0, 1);
    setTimeout(function() {
        service.getResultsByRequest(urlLocation, urlToScrap,(status, data) => {
            console.log('--SCRAP results')
            console.log( 'status :: ' + status )
            console.log( 'urlToScrap :: ' + urlToScrap )
            console.log( 'records scraped :: ' + data.length )
            console.log('-------------------------------')
            if( data.length > 0 ){
                saveRecord( data, function(a){
                  scrap_pages( urls, callback )
                })
            } else {
                scrap_pages( urls, callback )
            }
        })
    }, 3000);
  }
}

router.get('/', function(req, res, next) {
    let locations = {
        "AZ":"Arizona",
        "AR":"Arkansas",
        "CA":"California",
        "CO":"Colorado",
        "CT":"Connecticut",
        "DE":"Delaware",
        "DC":"District Of Columbia",
        "FL":"Florida",
        "GA":"Georgia",
        "ID":"Idaho",
        "IL":"Illinois",
        "IN":"Indiana",
        "IA":"Iowa",
        "KS":"Kansas",
        "KY":"Kentucky",
        "LA":"Louisiana",
        "ME":"Maine",
        "MD":"Maryland",
        "MA":"Massachusetts",
        "MI":"Michigan",
        "MN":"Minnesota",
        "MO":"Missouri",
        "MT":"Montana",
        "NE":"Nebraska",
        "NH":"New Hampshire",
        "NJ":"New Jersey",
        "NM":"New Mexico",
        "NY":"New York",
        "NC":"North Carolina",
        "ND":"North Dakota",
        "OH":"Ohio",
        "OK":"Oklahoma",
        "OR":"Oregon",
        "PA":"Pennsylvania",
        "PR":"Puerto Rico",
        "RI":"Rhode Island",
        "SC":"South Carolina",
        "SD":"South Dakota",
        "TN":"Tennessee",
        "TX":"Texas",
        "VT":"Vermont",
        "VI":"Virgin Islands",
        "VA":"Virginia",
        "WA":"Washington",
        "WV":"West Virginia",
        "WI":"Wisconsin",
        "WY":"Wyoming"
    }
    var baseUrl = "https://lottery.com/results/"
    var urls = []
    for( let code in locations ){
        let location = locations[code]
        let url = baseUrl + code +'/'
        // if( urls.length < 1 ){
            urls.push( {
                location: location,
                url: url
            } );
        // }
    }
    scrap_pages( urls, function(){
        console.log('All are done!!!');
    })
    res.send(locations);
});

module.exports = router;
