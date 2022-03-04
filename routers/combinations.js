var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();

var sql;

// /data/cocktails/:cocktail_name으로 대체
/*
  router.get('/cocktail_detail', function(req, res, next) {
      let{cocktail_name} = req.query;
  
      var sql = "select cocktail.cocktail_name, settingCocktailWithIngredient.ingredient_name, settingCocktailWithIngredient.vol, settingCocktailWithIngredient.tool from cocktail inner join settingCocktailWithIngredient on cocktail.cocktail_name = settingCocktailWithIngredient.cocktail_name and cocktail.cocktail_name=\""+cocktail_name+"\"";
  
      conn.query(sql, function(err, rows, fields) {
          if (err) console.log('query is not excuted. select fail...\n' + err);
          // else res.render('data.ejs', { list: rows });
          else res.json({list:rows});
      });
  });
*/

// 칵테일 이름에 해당하는 칵테일에 재료, 용량, 도구 추가
// 중복 검사 안함
router.post('/setting', function(req, res, next) {
    let{cocktail_uuid, cocktail_name, ingredient_uuid, ingredient_name, vol, tool} = req.body;

    sql = "insert into settingCocktailWithIngredient(settingCocktailWithIngredient_uuid, cocktail_uuid, cocktail_name, ingredient_uuid, ingredient_name, vol, tool)"
        +" values (uuid(),?,?,?,?,?,?)";

    var params = [cocktail_uuid, cocktail_name, ingredient_uuid, ingredient_name, vol, tool];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});
router.delete('/setting', function(req, res, next) {
    let{cocktail_uuid, ingredient_uuid} = req.body;

    sql = "delete from settingCocktailWithIngredient where cocktail_uuid=? and ingredient_uuid=?"

    var params = [cocktail_uuid, ingredient_uuid];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});
// /data/users/:user_id으로 대체
/*
  router.get('/user_download_list', function(req, res, next) {
      let{user_id} = req.body;
  
      var sql = "select * from downloadUserWithCocktail where user_id=?";
      var params = [user_id];
  
      conn.query(sql, params, function(err, rows, fields) {
          if (err) console.log('query is not excuted. select fail...\n' + err);
          // else res.render('data.ejs', { list: rows });
          else res.json("success");
      });
  });
*/

// 다운로드 테이블에 사용자 이름과 칵테일 이름을 묶어 한 행으로 추가
// 중복 검사
router.post('/download', function(req, res, next) {
    let{user_id, cocktail_uuid, cocktail_name} = req.body;

    sql = "insert into downloadUserWithCocktail(downloadUserWithCocktail_uuid, cocktail_uuid, cocktail_name, user_id)"
        +"values ( uuid(),?,?,?)";

    var params = [cocktail_uuid, cocktail_name, user_id];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});

// 다운로드 테이블에서 사용자 이름과 칵테일 이름, 두 값이 동시에 일치하면 삭제
router.delete('/download', function(req, res, next) {
    let{user_id, cocktail_name} = req.body;

    var sql = "delete from downloadUserWithCocktail where user_id=? and cocktail_name=?"
    var params = [user_id, cocktail_name];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});

// 댓글 테이블에서 칵테일 이름과 사용자 아이디 행을 추가
router.post('/comment', function(req, res, next) {
    let{cocktail_uuid, cocktail_name, user_id, comment} = req.body;

    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();

    sql = "insert into commentCocktailWithUser(commentCocktailWithUser_uuid, cocktail_uuid, cocktail_name, user_id, comment, time) values (uuid(), ?, ?, ?, ?, ?)";
   
    var params = [cocktail_uuid, cocktail_name, user_id, comment, year+"-"+month+"-"+date+" "+hour+":"+min+":"+sec];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});

//댓글 테이블에서 칵테일 이름과 사용자 아이디, 댓글, 시간을 기준으로 일치하는 행을 삭제
router.delete('/comment', function(req, res, next) {
    let{cocktail_uuid, user_id, comment, time} = req.body;

    var sql = "delete from commentCocktailWithUser where user_id=? and cocktail_uuid=? and comment=? and time=?"
    var params = [user_id, cocktail_uuid, comment, time];

    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});

module.exports = router;