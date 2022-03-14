var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();

var sql;

// 칵테일 이름 기준으로 나열된 칵테일 리스트 중 일부
router.get('/list', function(req, res, next) {
    let{start, end} = req.body;

    sql = "select * from cocktail order by cocktail_name limit "+Math.abs(end-start);
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

// 제시한 기준에 적합한 칵테일 리스트를 칵테일 작성자 기준으로 나열한 목록 중 일부
router.get('/list/standard', function(req, res, next) {
    let{show_std, show_std_content, start, end} = req.body;

    sql = "select * from cocktail where "+show_std+"=\""+show_std_content+"\" order by cocktail_writer limit "+start+", "+end;
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

// 칵테일 추가(이름이 이미 존재할 경우 추가하지 않고 에러를 반환)
// 중복 검사
router.post('/add', function(req, res, next) {
    let{cocktail_name, cocktail_writer, cocktail_image, cocktail_explanation, cocktail_glass, cocktail_base, cocktail_source} = req.body;
    
    sql = "insert into "
        +"cocktail(cocktail_uuid, cocktail_name, cocktail_writer, cocktail_image, cocktail_explanation, cocktail_glass, cocktail_base, cocktail_source) "
        +"values (uuid(), ?, ?, ?, ?, ?, ?, ?)";

    var params = [cocktail_name, cocktail_writer, cocktail_image, cocktail_explanation, cocktail_glass, cocktail_base, cocktail_source];
    conn.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});


// 칵테일 수정(칵테일 UUID을 기준으로 해당하는 객체 수정)
router.put('/modify', function(req, res, next) {
    let{bef_cocktail_uuid, aft_cocktail_name, aft_cocktail_writer, aft_cocktail_image, aft_cocktail_explanation, aft_cocktail_glass, aft_cocktail_base, aft_cocktail_source} = req.body;
    
    sql = "update cocktail "
        +"set cocktail_name=\""+aft_cocktail_name+"\", "
            +" cocktail_writer=\""+aft_cocktail_writer+"\", "
            +" cocktail_image=\""+aft_cocktail_image+"\", "
            +" cocktail_explanation=\""+aft_cocktail_explanation+"\", "
            +" cocktail_glass=\""+aft_cocktail_glass+"\", "
            +" cocktail_base=\""+aft_cocktail_base+"\", "
            +" cocktail_source=\""+aft_cocktail_source+"\" "
        +"where cocktail_uuid=\""+bef_cocktail_uuid+"\"";
        
    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('body is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else res.send("success")
    });
});

// 칵테일 이름으로 칵테일 UUID과 관련된 모든 정보들 추출
router.get('/:cocktail_uuid', function(req, res, next) {
    var params = req.params;

    var result = {};

    sql = 
        "select cocktail.*, settingCocktailWithIngredient.* "
        +"from cocktail "
        +"inner join settingCocktailWithIngredient "
        +"on cocktail.cocktail_uuid=settingCocktailWithIngredient.cocktail_uuid "
        +"and cocktail.cocktail_uuid=\""+params.cocktail_uuid+"\"";

    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('param is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else {
            if(rows.length > 0) {
                result["cocktail_uuid"]=(rows[0].cocktail_uuid);
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
                        setting_data_uuid:rows[i].settingCocktailWithIngredient_uuid,
                        ingredient_name:rows[i].ingredient_name,
                        vol:rows[i].vol,
                        tool:rows[i].tool
                    };
                    result["setting"].push(setting_data); 
                }
                
                sql = "select cocktail.*, "
                +"commentCocktailWithUser.* "
                +"from cocktail "
                +"inner join commentCocktailWithUser "
                +"on cocktail.cocktail_uuid=commentCocktailWithUser.cocktail_uuid "
                +"and cocktail.cocktail_uuid=\""+params.cocktail_uuid+"\"";
            
                conn.query(sql, function(err, rows, fields) {
                    if (err) {
                        console.log('param is not excuted. select fail...\n' + err);
                        
                        res.send("fail")
                    }
                    else {
                        for(var i=0; i<rows.length; i++) {
                            var comment_data = {
                                comment_data_uuid:rows[i].commentCocktailWithUser_uuid,
                                user_id:rows[i].user_id,
                                comment:rows[i].comment,
                                time:rows[i].time
                            };
                            result["comment"].push(comment_data); 
                        }
                        res.send(result);
                    } 
                });
            }
            else res.send("fail")
        } 
    });
});

// 칵테일 제거(칵테일 UUID이 동일한 객체를 삭제)
router.delete('/:cocktail_uuid', function(req, res, next) {
    var params = req.params;

    sql = "select * from cocktail where cocktail_uuid=\""+params.cocktail_uuid+"\"";

    console.log('sql ' + sql);

    conn.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('params is not excuted. select fail...\n' + err);
            
            res.send("fail")
        }
        else {

            if(rows.length > 0) {
                sql = "delete from cocktail where cocktail_uuid=\""+params.cocktail_uuid+"\"";
                conn.query(sql, function(err, rows, fields) {
                    if (err) {
                        console.log('params is not excuted. select fail...\n' + err);
                        
                        res.send("fail")
                    }
                    else res.send("success")
                });
            } else {
                res.send("fail")
            }
        }
    });

});

module.exports = router;