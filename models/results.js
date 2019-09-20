const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let resultSchema = new mongoose.Schema({
    location: { type: String },
    gameId: { type: String },
    gameName: { type: String },
    dateText: { type: String},
    dateTime: { type: String},
    jackpotLabel: { type: String},
    jackpotAmount: { type: String},
    powerBall: { type: String},
    powerPlayText: { type: String},
    jackpotResultBalls: Schema.Types.Mixed
}, { timestamps: true })

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;