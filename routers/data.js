var express = require('express');
var router = express.Router();

var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');


const ingredients = require('./ingredients');
const cocktails = require('./cocktails');
const users = require('./users');
const images = require('./images');
const combinations = require('./combinations');
const utils = require('./utils');

router.use('/ingredients', ingredients);
router.use('/cocktails', cocktails);
router.use('/users', users);
router.use('/images', images);
router.use('/combinations', combinations);
router.use('/utils', utils);

router.get('/', function(req, res, next) {
    res.send('data')
})

module.exports = router;