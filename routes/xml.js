var express = require('express');
var router = express.Router();
var xml = require('xml');
const model = require('../models/index');
const service = require('../service')

function get_game_xml(data){
    let game = [];

    game.push({ _attr: {
        game_id: data.gameId || "",
        game_name: data.gameName || "",
        update_time: data.updateTime || "",
    }})

    game.push({
       lastdraw_date: data.lastdraw_date || ""
    })

    game.push({
       lastdraw_numbers: data.lastdraw_numbers || ""
    })

    game.push({
       nextdraw_date: data.nextdraw_date || ""
    })

    var jackpotAmount = data.jackpotAmount || ""

    var jackpot = [
        {
            _attr: {
                date: data.jackpotDate || ""
            }
        }, jackpotAmount]

    game.push({
       jackpot: jackpot
    })


    // let lastdraw_numbers = "";
    // if(data.jackpotResultBalls && data.jackpotResultBalls.length > 0 ){
    //     lastdraw_numbers += data.jackpotResultBalls.join("-")
    // }
    // if( data.powerBall && data.powerBall != "" ){
    //     lastdraw_numbers += ", Powerball: " + data.powerBall
    // }
    // if( data.powerPlayText && data.powerPlayText != "" ){
    //     lastdraw_numbers += ", " + data.powerPlayText
    // }

    // if( lastdraw_numbers != "" ){
    //     game.push({
    //        lastdraw_number: lastdraw_numbers
    //     })
    // }



    // var jackpotAmount = data.jackpotAmount || ""

    // var jackpot = [
    //     {
    //         _attr: {
    //             date: data.dateText || ""
    //         }
    //     }, jackpotAmount]

    // game.push({
    //    jackpot: jackpot
    // })

    // console.log(game)


    return game

    // row = {
    //     game: game
    // }
}

function get_state_xml(state, data ){

    var groupGameWise = []

    data.map(function(row,key){
        let gameName = row.gameName
        let chk = gameName
        if( groupGameWise[chk] ){
        } else {
            groupGameWise[chk] = []
        }
        groupGameWise[chk].push( row )
    })

    let finalGames = []


    for( var y in groupGameWise ){
        let all = groupGameWise[y]

        var YgameName = ""
        var YgameId = ""
        var YnextDrawDate = ""
        var YlastDrawDate = ""
        var YlastNumbers = ""
        var YjackpotDate = ""
        var YjackpotAmount = ""
        var YupdateTime = ""


        for( z in all ){
            var game = all[z]

            YgameName = game.gameName
            YgameId = game.gameId

            if(YupdateTime == ""){
                YupdateTime = game.createdAt
            }

            if( game.jackpotResultBalls && game.jackpotResultBalls.length == 0 ){
                YnextDrawDate = game.dateText
                YjackpotDate = game.dateText
                YjackpotAmount = game.jackpotAmount
            }

            if( YlastDrawDate == "" && game.jackpotResultBalls && game.jackpotResultBalls.length > 0 ){
                YlastDrawDate = game.dateText
                YlastNumbers += game.jackpotResultBalls.join("-")
                if( game.powerBall && game.powerBall != "" ){
                    YlastNumbers += ", Powerball: " + game.powerBall
                }
                if( game.powerPlayText && game.powerPlayText != "" ){
                    YlastNumbers += ", " + game.powerPlayText
                }
            }
        }



        // console.log('------------------------')
        // console.log('------------------------')
        // console.log( groupGameWise[y])
        // console.log('------------------------')
        // console.log('------------------------')

        var obj = {
            gameName: YgameName,
            gameId: YgameId,
            lastdraw_date: YlastDrawDate,
            lastdraw_numbers: YlastNumbers,
            nextdraw_date: YnextDrawDate,
            jackpotAmount: YjackpotAmount,
            jackpotDate: YjackpotDate,
            updateTime : YupdateTime
        }

        finalGames.push(obj)

    }

    // console.log(finalGames)


    // groupGameWise.map(function(r,k){
    //     console.log( r )
    // })










    // console.log( state )
    // console.log('----')
    // console.log( groupGameWise )
    // console.log('**** ---- '+data.length)


    var stateProv = []

    stateProv.push({
        _attr: {
            stateprov_name: state,
            stateprov_id: service.getLocationId(state),
            country: "U.S.A"
        }
    })

    finalGames.map(function(game,key){
        let gameXml = get_game_xml(game)
        if(stateProv.length < 11){
            stateProv.push({
                game:gameXml
            })
        }
    })

    // data.map(function(game,key){
    //     let gameXml = get_game_xml(game)
    //     if(stateProv.length < 11){
    //         stateProv.push({
    //             game:gameXml
    //         })
    //     }
    // })

    // var stateXml = [
    //     {
    //         StateProv: stateProv
    //     }
    // ];

    return stateProv
}

router.get('/', function(req, res, next) {
    model.Results.find(function(err, results){
        let xmlData = [];

        let stateWiseData = [];

        results.map(function(data,key){
            let location = data.location
            let gameName = data.gameName

            let chk = location
            // key = ""

            if( stateWiseData[chk] ){

            } else {
                stateWiseData[chk] = []
            }

            stateWiseData[chk].push( data )

            // let game_xml = get_game_xml( data );
            // xmlData.push({
            //     game: game_xml
            // })
        })


        // console.log( stateWiseData )

        var finalXML = []

        // finalXML.push({
        //     _attr: {
        //         country: "U.S.A"
        //     }
        // })

        var stateXml = []

        for( var k in stateWiseData ){
            stateXml = get_state_xml(k, stateWiseData[k] )
            finalXML.push({
                StateProv: stateXml
            })
            // break
        }
        res.type('application/xml');
        res.send(xml({
            allgames: finalXML
        }));
    }).sort({createdAt: 1}).limit(5000)
});

module.exports = router;