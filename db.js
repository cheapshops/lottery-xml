const mongoose = require('mongoose');

module.exports.connect = () => {

    console.log(process.env.mongoUrl)

    let connect = mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true })
    var db = mongoose.connection;
    db.on("open", function(ref) {
        console.log("Connected to mongo server.");
    });

    db.on("error", function(err) {
        console.log("Could not connect to mongo server!", err);
    });
}