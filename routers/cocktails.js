var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('cocktails')
});

router.get('/detail', function(req, res, next) {
    let{cocktail_name} = req.query;

    console.log('respond with params : cocktail_name='+cocktail_name);

    var sql = "select * from cocktail where cocktail_name=?";
    var params = [cocktail_name];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json(rows);
    });
});

router.get('/list', function(req, res, next) {
    let{start, end} = req.query;

    console.log('respond with cocktail params : start='+start+', end='+end);

    var sql = "select * from cocktail order by cocktail_name limit "+(end-start);
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({ list: rows });
    });
});

router.get('/standard_list', function(req, res, next) {
    let{show_std, show_std_content} = req.body;

    console.log('respond with cocktail params : show_std='+show_std+', show_std_content='+show_std_content);

    var sql = "select * from cocktail where "+show_std+"=\""+show_std_content+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({ list: rows });
    });
});

router.post('/add', function(req, res, next) {
    let{cockatil_name, cockatil_image} = req.body;

    console.log('request with params : cockatil_name='+cockatil_name+', cockatil_image='+cockatil_image);

    var sql = "insert into cocktail(cockatil_name, cockatil_image) select \""+cockatil_name+"\", \""+cockatil_image+"\" from dual where not exists( select * from ingredient where cockatil_name=\""+cockatil_name+"\")";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('body is not excuted. select fail...\n' + err);
        else res.send("success")
    });
});

router.post('/delete', function(req, res, next) {
    let{cocktail_name} = req.body;

    console.log('request with params : cocktail_name='+cocktail_name);

    var sql = "delete from cocktail where cocktail_name=\""+cocktail_name+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('body is not excuted. select fail...\n' + err);
        else res.send("success")
    });
});


module.exports = router;