var express = require('express');
var router = express.Router();

router.get('/getXml', function(req, res, next) {
  res.send('This is for xml data');
});

module.exports = router;
