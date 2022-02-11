var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('data.js')
})

router.get('/ingredients', function(req, res, next) {
    var sql = "select * from settingingredient where settingingredient.cocktail_set_id = 'a_id'";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({ list: rows });
    });
});

module.exports = router;