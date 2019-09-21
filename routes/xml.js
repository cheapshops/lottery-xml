var express = require('express');
var router = express.Router();
var xml = require('xml');
const model = require('../models/index');


function get_game_xml(data){
    let game = [];

    game.push({ _attr: {
        gameId: data.gameId || "",
        game_name: data.gameName || "",
        update_time: data.dateTime || "",
    }})

    game.push({
       lastdraw_date: data.dateText
    })

    let lastdraw_numbers = "";
    if(data.jackpotResultBalls && data.jackpotResultBalls.length > 0 ){
        lastdraw_numbers += data.jackpotResultBalls.join("-")
    }
    if( data.powerBall && data.powerBall != "" ){
        lastdraw_numbers += ", Powerball: " + data.powerBall
    }
    if( data.powerPlayText && data.powerPlayText != "" ){
        lastdraw_numbers += ", " + data.powerPlayText
    }

    if( lastdraw_numbers != "" ){
        game.push({
           lastdraw_number: lastdraw_numbers
        })
    }

    var jackpot = [ { _attr: { date: '' } }, '']

    game.push({
       jackpot: jackpot
    })


    return game

    // row = {
    //     game: game
    // }
}

function get_state_xml(state, data ){

    console.log(data.length)
    console.log( state )
    console.log('----')

}

router.get('/', function(req, res, next) {
    model.Results.find(function(err, results){
        let xmlData = [];

        let stateWiseData = [];

        results.map(function(data,key){
            let location = data.location

            if( stateWiseData[location] ){

            } else {
                stateWiseData[location] = []
            }

            stateWiseData[location].push( data )

            // let game_xml = get_game_xml( data );
            // xmlData.push({
            //     game: game_xml
            // })
        })


        for( var k in stateWiseData ){
            $stateXml = get_state_xml(k, stateWiseData[k] )
        }

        // console.log( stateWiseData)
        res.type('application/xml');
        res.send(xml(xmlData));
    }).sort({createdAt: -1}).limit(500)
});

module.exports = router;