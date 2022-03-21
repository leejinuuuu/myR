const { response } = require('express');
var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

var fs = require('fs');


// var rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
var rootPath = "C:/Users/jinw8/Desktop";
var basePath = rootPath + "/" + "springboot_upload/";


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, basePath);
    },
  
    filename: function(req, file, cb) {
        console.log("file is exist ? " + fs.existsSync(basePath+file.originalname))
        var i = 1;
        var fileName = file.originalname
        console.log("file.originalname.lastIndexOf('.') : " + file.originalname.lastIndexOf('.'));

        while(fs.existsSync(basePath+fileName)) {
            fileName = file.originalname.slice(0, -4).concat("("+i+")").concat(file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length));
            console.log("fileName : " + fileName);
            i++;
        }

        cb(null, fileName);
    }
  });
  

var upload = multer({ storage: storage })

router.post(['/uploads'], upload.any(), (req, res) => {
    res.send("success");
});

router.get('/:name', function(req, res, next) {
    var params = req.params;
    if(params.name != null) {
        fs.readFile(basePath + params.name, function(err, data) {
            res.writeHead(200);
            res.write(data);
            res.end();
        });
    }
})

module.exports = router;