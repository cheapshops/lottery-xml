const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let resultLotteryUsaSchema = new mongoose.Schema({
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

const ResultLotteryUsa = mongoose.model('ResultLotteryUsa', resultLotteryUsaSchema);
module.exports = ResultLotteryUsa;