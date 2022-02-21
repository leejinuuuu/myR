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

router.get('/', function(req, res, next) {
    res.send('images')
});

router.post(['/uploads'], upload.any(), (req, res) => {
    console.log(req.body);
    console.log(req.files);
    res.send("success");
});

router.get('/name', function(req, res, next) {
    let{image_name}=req.query;
    if(image_name != null) {
        fs.readFile(__dirname + '\\res\\' + image_name, function(err, data) {
            res.writeHead(200);
            res.write(data);
            res.end();
        });
    }
})

module.exports = router;