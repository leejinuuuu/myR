var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('cocktails')
});

var sql;

router.get('/detail', function(req, res, next) {
    let{cocktail_name} = req.query;

    var result = {};

    console.log('respond with params : cocktail_name='+cocktail_name);

    sql = "select cocktail.*, settingCocktailWithIngredient.* from cocktail inner join settingCocktailWithIngredient on cocktail.cocktail_name=settingCocktailWithIngredient.cocktail_name and cocktail.cocktail_name=?";
    var params = [cocktail_name];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        else {
            result["cocktail_name"]=(rows[0].cocktail_name);
            result["cocktail_writer"]=(rows[0].cocktail_writer);
            result["cocktail_image"]=(rows[0].cocktail_image);
            result["cocktail_explanation"]=(rows[0].cocktail_explanation);
            result["cocktail_glass"]=(rows[0].cocktail_glass);
            result["cocktail_base"]=(rows[0].cocktail_base);
            result["cocktail_source"]=(rows[0].cocktail_source);
            result["setting"]=[];
            result["comment"]=[];

            for(var i=0; i<rows.length; i++) {
                var setting_data = {
                    ingredient_name:rows[i].ingredient_name,
                    vol:rows[i].vol,
                    tool:rows[i].tool
                };
                result["setting"].push(setting_data); 
            }
        } 
    });

    sql = "select cocktail.*, commentCocktailWithUser.user_id, commentCocktailWithUser.comment, commentCocktailWithUser.time from cocktail inner join commentCocktailWithUser on cocktail.cocktail_name=commentCocktailWithUser.cocktail_name and cocktail.cocktail_name=?";
    var params = [cocktail_name];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        else {

            for(var i=0; i<rows.length; i++) {
                var comment_data = {
                    user_id:rows[i].user_id,
                    comment:rows[i].comment,
                    time:rows[i].time
                };
                result["comment"].push(comment_data); 
            }
            
            res.send(result);
        } 
    });
});

router.get('/list', function(req, res, next) {
    let{start, end} = req.query;

    console.log('respond with cocktail params : start='+start+', end='+end);

    sql = "select * from cocktail order by cocktail_name limit "+(end-start);
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({ list: rows });
    });
});

router.get('/standard_list', function(req, res, next) {
    let{show_std, show_std_content} = req.body;

    console.log('respond with cocktail params : show_std='+show_std+', show_std_content='+show_std_content);

    sql = "select * from cocktail where "+show_std+"=\""+show_std_content+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({ list: rows });
    });
});

router.post('/add', function(req, res, next) {
    let{cockatil_name, cockatil_image} = req.body;

    console.log('request with params : cockatil_name='+cockatil_name+', cockatil_image='+cockatil_image);

    sql = "insert into cocktail(cockatil_name, cockatil_image) select \""+cockatil_name+"\", \""+cockatil_image+"\" from dual where not exists( select * from ingredient where cockatil_name=\""+cockatil_name+"\")";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('body is not excuted. select fail...\n' + err);
        else res.send("success")
    });
});

router.post('/delete', function(req, res, next) {
    let{cocktail_name} = req.body;

    console.log('request with params : cocktail_name='+cocktail_name);

    sql = "delete from cocktail where cocktail_name=\""+cocktail_name+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('body is not excuted. select fail...\n' + err);
        else res.send("success")
    });
});


module.exports = router;