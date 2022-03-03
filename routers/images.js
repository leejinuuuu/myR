const { response } = require('express');
var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

var fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/res/');
    },
  
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
  });
  
var upload = multer({ storage: storage })

router.post(['/uploads'], upload.any(), (req, res) => {
    res.send("success");
});

router.get('/:name', function(req, res, next) {
    var params = req.params;
    if(params.name != null) {
        fs.readFile(__dirname + '\\res\\' + params.name, function(err, data) {
            res.writeHead(200);
            res.write(data);
            res.end();
        });
    }
})

module.exports = router;