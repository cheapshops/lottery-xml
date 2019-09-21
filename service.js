var request = require("request");
var cheerio = require('cheerio');
var csv = require('csvtojson')

const csvFilePath="./game_ids.csv"

const getGameIds = async function (){
    var allGamesId = []
    await csv()
    .fromFile(csvFilePath)
    .then((arr)=>{
        for( var k in arr ){
            var row = arr[k]
            var kk = row['location'] +'_'+row['gamesName'];
            kk = kk.toLowerCase()
            allGamesId[kk] = row['gamesId']
        }
    })
    return allGamesId
}

const getResultsByRequest = function( location, url, callback ){
    console.log('scraping URL --- ' + url)
  var options = {
    url: url,
    headers: {
      // 'Content-Type': 'application/json',
      // 'accept-encoding': 'gzip, deflate, br',
      // 'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      // 'cache-control': 'no-cache',
      // 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
    }
  };
  request(options, async function (error, response, body) {
    if (!error) {
        let arrGameIds = await getGameIds()

        let allResults = []
        jQuery = cheerio.load( body );
        console.log(jQuery('.js-results-container').length)
        if( jQuery('.js-results-container').find('.result-list-container').length > 0 ){
          jQuery('.js-results-container').find('.result-list-container').each(function(){
            let gameName = jQuery(this).find('.result-list-header').find('.result-list-name').text() || "";
            if( jQuery(this).find('.result-list').find('.result-list-item').length > 0 ){
                jQuery(this).find('.result-list').find('.result-list-item').each(function(){
                    let dateText = jQuery(this).find('.result-date-wrap').find('time').text() || "";
                    let dateTime = jQuery(this).find('.result-date-wrap').find('time').attr('datetime') || "";
                    let jackpotLabel = jQuery(this).find('.result-jackpot-wrap').find('.result-jackpot-label').text() || "";
                    let jackpotAmount = jQuery(this).find('.result-jackpot-wrap').find('.result-jackpot').text() || "";
                    let jackpotResultBalls = []
                    let powerBall = ""
                    if( jQuery(this).find('.result-content-wrap').find('.result-numbers').find('.lottery-ball-wrap').length > 0 ){
                        jQuery(this).find('.result-content-wrap').find('.result-numbers').find('.lottery-ball-wrap').each(function(){
                            let ballNumber = jQuery(this).find('.lottery-number').text() || "";
                            if(jQuery(this).find('div.bonus').length > 0 ){
                                powerBall = ballNumber
                            } else {
                                jackpotResultBalls.push(ballNumber)
                            }
                        })
                    }
                    let powerPlayText = jQuery(this).find('.result-content-wrap').find('.lottery-item-bonus').text() || ""

                    //extract game id
                    let keyy = location + '_' + gameName;

                    keyy = keyy.toLowerCase()

                    let gameId = arrGameIds[keyy] || ""

                    let res = {
                        gameId: gameId,
                        location: location,
                        gameName: gameName,
                        dateText: dateText,
                        dateTime: dateTime,
                        jackpotLabel: jackpotLabel,
                        jackpotAmount: jackpotAmount,
                        jackpotResultBalls: jackpotResultBalls,
                        powerBall: powerBall,
                        powerPlayText: powerPlayText
                    }
                    // console.log( res )
                    allResults.push(res)
                })
            }
          })
        }
      callback('success',allResults);
    } else {
      callback('error', [])
    }
  });
}

const getLocations = function( ){
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

    return locations
}

const getLocationId = function(location){
    let locations = getLocations();
    for( var k in locations){
        if( locations[k] == location ){
            return k
        }
    }
    return ""
}


module.exports = {
    getLocations:getLocations,
    getLocationId:getLocationId,
    getResultsByRequest: getResultsByRequest,
    getGameIds: getGameIds
}