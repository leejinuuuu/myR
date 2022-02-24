var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.send('users')
});

router.get('/detail', function(req, res, next) {
    let{nickname} = req.query;

    console.log('respond with user body : nickname='+nickname);

    var sql = "select * from user where user_nickname=\""+nickname+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.send({rows});
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
    let{id, password} = req.body;

    console.log('respond with user body : id='+id+', password='+password);

    var sql = "insert into user(user_id, user_password, user_nickname) select \""+id+"\",\""+password+"\",\""+id+"\" from dual where not exists(select * from user where user_id=\""+id+"\")";
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.send("success");
    });
});

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
    let{id, password, nickname} = req.body;

    console.log('respond with user body : id='+id+', password='+password+', nickname='+nickname);

    var sql = "update user set user_nickname=\""+nickname+"\" where user_id=\""+id+"\" and user_password=\""+password+"\""; 
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.send("success");
    });
});

router.get('/list', function(req, res, next) {
    let{start, end} = req.query;

    console.log('respond with user params : start='+start+', end='+end);

    var sql = "select * from user order by user_id limit "+(end-start);
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err);
        // else res.render('data.ejs', { list: rows });
        else res.json({ list: rows });
    });
});

module.exports = router;