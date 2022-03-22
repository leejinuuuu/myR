var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();

const multer = require('multer');
const path = require('path');
var fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, basePath);
    },
  
    filename: function(req, file, cb) {
        var i = 1;
        var fileName = file.originalname

        while(fs.existsSync(basePath+fileName)) {
            fileName = file.originalname.slice(0, -4).concat("("+i+")").concat(file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length));
            i++;
        }

        save_fileName = fileName;
        cb(null, fileName);
    }
  });

var upload = multer({ storage: storage })

var save_fileName;

var sql;

// 재료 이름을 기준으로 나열된 재료 리스트 중 일부
router.get('/ls', function(req, res, next) {
    let{start, end} = req.body;

    sql = "select * from ingredient order by ingredient_name limit "+start+", "+end;
    conn.query(sql, function(err, rows, fields) {
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

// 재료 추가(이름이 이미 존재할 경우 추가하지 않고 에러를 반환)
// 중복 검사
router.post('/add', upload.any(), function(req, res, next) {
    let ingredient_file_name = req.files[0].originalname;
    let {ingredient_name} = req.body;

    sql = "insert into"
    +" ingredient(ingredient_uuid, ingredient_name, ingredient_image)"
    +" values (uuid(), ?, ?)";

    if(save_fileName == null)
        save_fileName = ingredient_file_name;

    var params = [ingredient_name, save_fileName];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }   
        else res.send("success");
    });
});

// 재료 이름으로 재료 테이블에서 정보 추출
router.get('/:ingredient_uuid', function(req, res, next) {
    var params = req.params;

    sql = "select * from ingredient where ingredient_uuid=\""+params.ingredient_uuid+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else {
            if(rows.length > 0) res.json(rows);
            else res.send("fail")
        }
    });
});

// 재료 삭제
router.delete('/:ingredient_uuid', function(req, res, next) {
    var params = req.params;

    sql = "delete from ingredient where ingredient_uuid=\""+params.ingredient_uuid+"\"";
    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }   
        else {
            fs.unlink(basePath + rows.cocktail_name, err => {
                if(err != null) {
                    console.log("file delete err : "+err);
                    res.send("fail");
                } else 
                    res.send("success");
            })
            
            res.json("success");
        } 
    });
});

module.exports = router;