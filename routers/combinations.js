var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('combinations')
});

router.get('/cocktail_detail', function(req, res, next) {
    let{cocktail_name} = req.query;

    var sql = "select cocktail.cocktail_name, settingCocktailWithIngredient.ingredient_name, settingCocktailWithIngredient.vol, settingCocktailWithIngredient.tool from cocktail inner join settingCocktailWithIngredient on cocktail.cocktail_name = settingCocktailWithIngredient.cocktail_name and cocktail.cocktail_name=\""+cocktail_name+"\"";

    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({list:rows});
    });
});

router.post('/cocktail_add', function(req, res, next) {
    let{cocktail_name, ingredient_name, vol, tool} = req.body;

    var sql = "insert into settingCocktailWithIngredient(num, cocktail_name, ingredient_name, vol, tool) select null, ?, ?, ?, ? from dual where not exists(select * from settingCocktailWithIngredient where cocktail_name=? and ingredient_name=?)";
    var params = [cocktail_name, ingredient_name, vol, tool, cocktail_name, ingredient_name];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json("success");
    });
});

router.post('/user_download_list', function(req, res, next) {
    let{user_id} = req.body;

    var sql = "select * from downloadUserWithCocktail where user_id=?";
    var params = [user_id];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json("success");
    });
});

router.post('/user_download_add', function(req, res, next) {
    let{user_id, cocktail_name} = req.body;

    var sql = "insert into downloadUserWithCocktail(num, cocktail_name, user_id) select null, ?, ? from dual where not exists(select * from downloadUserWithCocktail where cocktail_name=? and user_id=?)";
    var params = [cocktail_name, user_id, cocktail_name, user_id];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json("success");
    });
});

router.post('/user_download_delete', function(req, res, next) {
    let{user_id, cocktail_name} = req.body;

    var sql = "delete from downloadUserWithCocktail where user_id=? and cocktail_name=?"
    var params = [user_id, cocktail_name];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json("success");
    });
});

router.post('/cocktail_comment_add', function(req, res, next) {
    let{cocktail_name, user_id, comment} = req.body;

    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let day = today.getDay();  // 요일
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();

    var sql = "insert into commentCocktailWithUser(num, cocktail_name, user_id, comment, time) select null, ?, ?, ?, ? ";
    var params = [cocktail_name, user_id, comment, year+"-"+month+"-"+date+" "+hour+":"+min+":"+sec];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json("success");
    });
});

router.post('/cocktail_comment_delete', function(req, res, next) {
    let{cocktail_name, user_id, comment, time} = req.body;

    var sql = "delete from commentCocktailWithUser where user_id=? and cocktail_name=? and comment=? and time=?"
    var params = [user_id, cocktail_name, comment, time];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json("success");
    });
});

module.exports = router;