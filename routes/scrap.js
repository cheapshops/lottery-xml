var express = require('express');
var router = express.Router();
const service = require('../service')

router.get('/', function(req, res, next) {
    let locations = {
        "AZ" : "Arizona",
        // "AR" : "Arkansas",
        // "CA" : "California",
        // "CO" : "Colorado"
    }
    // ,", "CT:Connecticut,", "DE:Delaware,", "DC:District Of Columbia,", "FL:Florida,", "GA:Georgia,", "ID:Idaho,", "IL:Illinois,", "IN:Indiana,", "IA:Iowa,", "KS:Kansas,", "KY:Kentucky,", "LA:Louisiana,", "ME:Maine,", "MD:Maryland,", "MA:Massachusetts,", "MI:Michigan,", "MN:Minnesota,", "MO:Missouri,", "MT:Montana,", "NE:Nebraska,", "NH:New Hampshire,", "NJ:New Jersey,", "NM:New Mexico,", "NY:New York,", "NC:North Carolina,", "ND:North Dakota,", "OH:Ohio,", "OK:Oklahoma,", "OR:Oregon,", "PA:Pennsylvania,", "PR:Puerto Rico,", "RI:Rhode Island,", "SC:South Carolina,", "SD:South Dakota,", "TN:Tennessee,", "TX:Texas,", "VT:Vermont,", "VI:Virgin Islands,", "VA:Virginia,", "WA:Washington,", "WV:West Virginia,", "WI:Wisconsin,", "WY:Wyoming,"]

    var baseUrl = "https://lottery.com/results/"

    for( let code in locations ){
        let location = locations[code]

        let url = baseUrl + code +'/'

        service.getResultsByRequest(url,(status, body) => {
            console.log(body)
            console.log(status)
        })

        console.log( code +" -- " + location + '--' + url)
    }

    res.send(locations);
});

module.exports = router;
