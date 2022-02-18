var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('ingredient')
});

router.get('/detail', function(req, res, next) {
    let{ingredient_name} = req.query;

    console.log('respond with ingredient params : ingredient_name='+ingredient_name);

    var sql = "select * from ingredient where ingredient_name=?";
    var params = [ingredient_name];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json(rows);
    });
});

router.get('/list', function(req, res, next) {
    let{start, end} = req.query;

    console.log('respond with params : start='+start+', end='+end);

    var sql = "select * from ingredient order by ingredient_name limit "+(end-start);
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({ list: rows });
    });
});

module.exports = router;