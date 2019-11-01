var express = require('express');
var router = express.Router();
var xml = require('xml');
var moment = require('moment');
const model = require('../../models/index');
const service = require('../../service')

/* start all xml*/
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
        }, jackpotAmount
    ]
    game.push({
       jackpot: jackpot
    })

    return game
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

    // if( state == 'Florida' ){
    //     console.log(groupGameWise['Pick 2 Midday'])
    // }

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

    //     if( state == "Arizona"){

    //     console.log('#############################')
    //     console.log('#############################')
    //     console.log('#############################')
    //     console.log('#############################')
    //     console.log('#############################')
    //     console.log(all)

    // }


        for( z in all ){
            var game = all[z]

            YgameName = game.gameName
            YgameId = game.gameId

            if(YupdateTime == ""){
                YupdateTime = game.createdAt
            }

            if( game.jackpotResultBalls && game.jackpotResultBalls.length == 0 ){
                YnextDrawDate = game.dateText

            }

            if( game.jackpotResultBalls && game.jackpotResultBalls.length > 0 ){
                YlastDrawDate = game.dateText
                YlastNumbers = game.jackpotResultBalls.join("-")
                if( game.powerBall ){
                    YlastNumbers += ", Powerball: " + game.powerBall
                }
                if( game.powerPlayText ){
                    YlastNumbers += ", " + game.powerPlayText
                }
                YjackpotDate = game.dateText
                YjackpotAmount = game.jackpotAmount
            }
        }

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
    return stateProv
}

router.get('/', function(req, res, next) {
    model.ResultsLotteryUsa.find({gameId:{$ne:""}},function(err, results){
        let xmlData = [];
        let stateWiseData = [];

        console.log('*******')
        console.log('*******')
        console.log('*******')
        console.log(err)

        results.map(function(data,key){
            let location = data.location
            let gameName = data.gameName
            let chk = location
            if( stateWiseData[chk] ){

            } else {
                stateWiseData[chk] = []
            }
            stateWiseData[chk].push( data )
        })

        var finalXML = []
        var stateXml = []
        for( var k in stateWiseData ){
            stateXml = get_state_xml(k, stateWiseData[k] )
            finalXML.push({
                StateProv: stateXml
            })
        }
        res.type('application/xml');
        res.send(xml({
            allgames: finalXML
        }));
    }).sort({dateTime: 1}).limit(50000)
});
/* start all xml*/

/* search on gameid and location all xml*/

function get_draw_xml(data){
    let draw = [];
    let dateFormatted = new Date(data.dateTime);
    draw.push({
       draw_date: data.dateTime && moment(data.dateTime).format("ddd MM/DD/YY") || ""
    })
    let YlastNumbers = ""
    if( data.jackpotResultBalls && data.jackpotResultBalls.length > 0 ){
        YlastNumbers += data.jackpotResultBalls.join("-")
        if( YlastNumbers != "" && data.powerBall && data.powerBall != "" ){
            YlastNumbers += "-" + data.powerBall
        }
    }
    draw.push({
       drawing_results: YlastNumbers
    })
    return draw
}

router.get('/search', function(req, res, next) {
    let filter = {}
    let gameId = ""
    let location = "";
    if( req.query && req.query.game && req.query.game != "" ){
        gameId = req.query.game
    }
    if( req.query && req.query.location && req.query.location != "" ){
        location = req.query.location
    }
    if( gameId == "" || location == "" ){
        res.type('application/xml');
        res.send(xml({
            REQUEST_RESULTS_BY_DATE: []
        }));
    } else {
        let filter = {
            gameId: gameId,
            location: location,
        }
        model.ResultsLotteryUsa.find(filter, function(err, results){
            let xmlData = [];
            let stateWiseData = [];
            // console.log( results)
            var finalXML = []
            finalXML.push({
                state: location
            })
            finalXML.push({
                game: gameId
            })
            let draws = []
            for(var k in results ){
                let kk = results[k]
                drawXml = get_draw_xml(kk)
                if( kk.jackpotResultBalls && kk.jackpotResultBalls.length > 0 ){
                    draws.push( {
                        draw: drawXml
                    })
                }
                if( draws.length >= 30 ){
                    break;
                }
            }
            finalXML.push({
                draws: draws
            })
            res.type('application/xml');
            res.send(xml({
                REQUEST_RESULTS_BY_DATE: finalXML
            }));
        }).sort({dateTime: -1}).limit(1000)
    }
});

/* search on gameid and location all xml*/




/* start xml smart pick */
router.get('/smartpick', function(req, res, next) {
    let filter = {}
    let gameId = ""
    let location = "";
    if( req.query && req.query.game && req.query.game != "" ){
        gameId = req.query.game
    }
    if( req.query && req.query.location && req.query.location != "" ){
        location = req.query.location
    }
    if( gameId == "" || location == "" ){
        res.type('application/xml');
        res.send(xml({
            REQUEST_SMART_PICK: []
        }));
    } else {
        let filter = {
            gameId: gameId,
            location: location,
        }
        model.ResultsLotteryUsa.find(filter, async function(err, results){
            let gameName = await service.getGameName( gameId)
            var finalXML = []
            finalXML.push({
                state: location
            })
            finalXML.push({
                game: gameName
            })
            let startDate = ""
            let endDate = ""
            let jackpotNumberArr = []
            let top_hot_numbersArr = []
            let top_cold_numbersArr = []
            if( results.length > 0 ){
                for(var k in results){
                    let kk = results[k]
                    if( kk.dateTime ){
                        if( endDate == ""){
                            endDate = kk.dateTime
                        }
                        startDate = kk.dateTime
                    }
                    if(kk.jackpotResultBalls && kk.jackpotResultBalls.length > 0 ){
                        jackpotNumberArr = jackpotNumberArr.concat(kk.jackpotResultBalls)
                    }
                    if(kk.powerBall && kk.powerBall != ""){
                        jackpotNumberArr.push( kk.powerBall)
                    }
                }
            }
            if( jackpotNumberArr.length > 0 ){
                let f = {};
                for( var k in jackpotNumberArr ){
                    var n = jackpotNumberArr[k]
                    if( f[n] ){
                        f[n] = f[n] + 1
                    } else {
                        f[n] = 1
                    }
                }
                var sortable = [];
                for (var v in f) {
                    sortable.push([v, f[v]]);
                }
                sortable.sort(function(a, b) {
                    return b[1] - a[1];
                });
                if( sortable.length > 0) {
                    for( var k in sortable ){
                        let chk = sortable[k]
                        if( top_hot_numbersArr.length < 3 ){
                            top_hot_numbersArr.push(chk[0])
                        }
                    }
                    for(i = sortable.length - 1 ; i > 0; i--){
                        let chk = sortable[i]
                        if( top_cold_numbersArr.length < 3 && top_hot_numbersArr.indexOf(chk[0]) == -1 ){
                            top_cold_numbersArr.push(chk[0])
                        }
                    }
                }
            }
            finalXML.push({
                start_date: startDate && moment(startDate).format("ddd MM/DD/YY") || ""
            })
            finalXML.push({
                end_date: endDate && moment(endDate).format("ddd MM/DD/YY") || ""
            })
            finalXML.push({
                top_hot_numbers: top_hot_numbersArr.toString()
            })
            finalXML.push({
                top_cold_numbers: top_cold_numbersArr.toString()
            })
            res.type('application/xml');
            res.send(xml({
                REQUEST_SMART_PICK: finalXML
            }));
        }).sort({dateTime: -1})
    }
});

module.exports = router;