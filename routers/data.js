var express = require('express');
var router = express.Router();

const ingredients = require('./ingredients');
const cocktails = require('./cocktails');
const users = require('./users');
const images = require('./images');
const combinations = require('./combinations');
const utils = require('./utils');

// global values

// var rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
global.rootPath = "C:/Users/jinw8/Desktop";
global.basePath = rootPath + "/" + "upload_files_with_server/nodejs/";

router.use('/ingredients', ingredients);
router.use('/cocktails', cocktails);
router.use('/users', users);
router.use('/images', images);
router.use('/combinations', combinations);
router.use('/utils', utils);

module.exports = router;