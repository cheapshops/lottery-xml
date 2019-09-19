var request = require("request");
var cheerio = require('cheerio');

const getResultsByRequest = function( url, callback ){
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
  request(options, function (error, response, body) {
    if (!error) {
        let results = []
        jQuery = cheerio.load( body );
        console.log(jQuery('.js-results-container').length)
        if( jQuery('.js-results-container').find('.result-list-container').length > 0 ){
          jQuery('.js-results-container').find('.result-list-container').each(function(){
            let gameName = jQuery(this).find('.result-list-header').find('.result-list-name').text();
            // companyName = jQuery(this).find('.heading').find('a').text();
            // url = jQuery(this).find('.heading').find('a').attr('href');
            // console.log(companyName)
            // row = {
            //   name :companyName,
            //   url : url
            // }
            // if( typeof companyName != 'undefined' ){
            //   all_urls.push( row );
            // }
            results.push({
                gameName: gameName
            })
          })
        }
      callback('success',results);
    } else {
      callback('error', [])
    }
  });
}


module.exports = {
  getResultsByRequest: getResultsByRequest,
}