var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('users')
});

router.get('/detail', function(req, res, next) {
    let{user_id} = req.body;

    var sql = "select user.*, downloadUserWithCocktail.cocktail_name from user inner join downloadUserWithCocktail on user.user_id=downloadUserWithCocktail.user_id and user.user_id=?";
    var params = [user_id];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else {
            var result = {};
            result["user_id"]=(rows[0].user_id);
            result["user_password"]=(rows[0].user_password);
            result["user_nickname"]=(rows[0].user_nickname);
            result["user_email"]=(rows[0].user_email);
            result["cocktail_name"]=[];

            for(var i=0; i<rows.length; i++)
                result["cocktail_name"].push(rows[i].cocktail_name);  
            
            res.send(result);
        } 
    });
})

router.post('/login', function(req, res, next) {
    let{id, password} = req.body;

    console.log('respond with user body : id='+id+', password='+password);

    var sql = "select * from user where user_id=\""+id+"\" and user_password=\""+password+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else {
            if(rows.length == 0) 
                res.send("fail");
            else
                res.send("success");
        }
    });
});

router.post('/signup', function(req, res, next) {
    let{id, password, nickname, email} = req.body;

    console.log('respond with user body : id='+id+', password='+password+', nickname='+nickname+', email='+email);

    var sql = "insert into user(user_id, user_password, user_nickname, user_email) select \""+id+"\",\""+password+"\",\""+nickname+"\",\""+email+"\" from dual where not exists(select * from user where user_id=\""+id+"\")";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        else res.send("success");
    });
});

router.get('/search', function(req, res, next) {
    let{email} = req.query;

    console.log('respond with user body : email='+email);

    var sql = "select * from user where user_email=\""+email+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        else res.send(rows)
    })
})

router.post('/delete', function(req, res, next) {
    let{id, password} = req.body;

    console.log('respond with user body : id='+id+', password='+password);

    var sql = "delete from user where user_id=\""+id+"\" and user_password=\""+password+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.send("success");
    });
});

router.post('/modify', function(req, res, next) {
    let{id, password, nickname, email} = req.body;

    console.log('respond with user body : id='+id+', password='+password+', nickname='+nickname+', email='+email);

    var sql = "update user set user_nickname=\""+nickname+"\" where user_id=\""+id+"\" and user_password=\""+password+"\" and user_email=\""+email+"\""; 
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.send("success");
    });
});

module.exports = router;