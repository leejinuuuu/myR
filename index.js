const express = require('express')
const app = express()
var bodyParser = require('body-parser');

const helmet = require('helmet');

const port = 8080

const dataRouter = require('./routers/data');

//security
app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/data', dataRouter);

app.get('/', function(req, res, next) {
    res.render('index.ejs')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})