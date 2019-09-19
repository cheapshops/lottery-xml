const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let resultSchema = new mongoose.Schema({
    location: { type: String },
    gameId: { type: String },
    gameName: { type: String },
    jackpot: { type: String },
    result: { type: String },
    resultObject: Schema.Types.Mixed
}, { timestamps: true })

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;