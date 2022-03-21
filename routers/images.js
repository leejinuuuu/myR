const { response } = require('express');
var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

var fs = require('fs');


var save_fileName;

// var rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
var rootPath = "C:/Users/jinw8/Desktop";
var basePath = rootPath + "/" + "upload_files_with_server/nodejs/";

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