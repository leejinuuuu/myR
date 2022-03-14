var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();

var sql;

// 임의의 내용과 어떠한 테이블의 어떠한 행 안의 객체들의 유사성을 고려, 유사순으로 나열한 목록
router.get('/search', function(req, res, next) {
    let{search_table, search_std, search_content, start, end} = req.body;

    sql = "select "+search_std+", levenshtein("+search_std+", ?) as distance from "+search_table+" where "+search_std+" order by distance asc limit "+start+", "+end;
 
    var params = [search_content];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }   
        else {
            if(rows.length > 0) res.json({ list:rows });
            else res.send("fail")
        }
    });
});

module.exports = router;