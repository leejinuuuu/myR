var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('ingredient')
});

router.get('/search', function(req, res, next) {
    let{search_table, search_std, search_content} = req.body;

    console.log('request with params : search_std='+search_std);

    var sql = "select "+search_std+", levenshtein("+search_std+", ?) as distance from "+search_table+" where "+search_std+" order by distance asc";
    var params = [search_content];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('body is not excuted. select fail...\n' + err);
        else res.json({rows})
    });
});

module.exports = router;