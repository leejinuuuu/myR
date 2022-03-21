var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();

var sql;



// 로그인
router.post('/login', function(req, res, next) {
    let{id, password} = req.body;

    sql = "select * from user where user_id=\""+id+"\" and user_password=\""+password+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);

            res.send("fail");
        }
        else {
            if(rows.length > 0)  res.send("success");
            else res.send("fail");
        }
    });
});

// 사용자 추가
// 중복 검사
router.post('/signup', function(req, res, next) {
    let{id, password, nickname, email} = req.body;

    sql = "insert into "
        +"user(user_id, user_password, user_nickname, user_email) "
        +"values (?,?,?,?)";

    var params = [id, password, nickname, email];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);

            res.send("fail");
        }
        else res.send("success");
    });
});

// 사용자 아이디 검색
router.get('/search', function(req, res, next) {
    let{email} = req.body;

    sql = "select * from user where user_email=\""+email+"\"";
    conn.query(sql, function(err, user, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);

            res.send("fail");
        }
        else {
            if(user.length > 0) res.send({user});
            else res.send("fail");
        }
    })
})

// 사용자 아이디, 비밀번호, 이메일을 기준으로 해당하는 사용자의 사용자 닉네임을 수정
router.put('/mod', function(req, res, next) {
    let{id, password, nickname, email} = req.body;

    sql = "update user set user_nickname=\""+nickname+"\" where user_id=\""+id+"\" and user_password=\""+password+"\" and user_email=\""+email+"\""; 
    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);

            res.send("fail");
        }
        else res.send("success");
    });
});

// 사용자 이름으로 사용자 이름과 관련된 모든 정보들 추출
router.get('/:user_id', function(req, res, next) {
    var params = req.params;

    sql = "select user.*, downloadUserWithCocktail.cocktail_name from user inner join downloadUserWithCocktail on user.user_id=downloadUserWithCocktail.user_id and user.user_id=\""+params.user_id+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('params is not excuted. select fail...\n' + err);

            res.send("fail");
        }
        else {
            if(rows.length > 0) {
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
            else res.send("fail");
        } 
    });
})

// 사용자 아이디, 비밀번호를 기준으로 해당하는 사용자 객체 삭제
router.delete('/:user_id', function(req, res, next) {
    var params = req.params;

    sql = "delete from user where user_id=\""+params.user_id+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);

            res.send("fail");
        }
        else res.send("success");
    });
});

module.exports = router;