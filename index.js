const express = require('express')
const app = express()
var bodyParser = require('body-parser');

const helmet = require('helmet');

const port = 8080

const dataRouter = require('./routers/data');

const redis = require("redis");
const client = redis.createClient(6379, "127.0.0.1");

//security
app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/data', dataRouter);

app.get('/', function(req, res, next) {
    var phone = "test";

    client.get(phone, function(err, value) {
        console.log(value);
    })

    res.render('index.ejs')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})