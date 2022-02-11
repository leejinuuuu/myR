const express = require('express')
const app = express()

const port = 8080

const dataRouter = require('./routers/data');

app.use('/data', dataRouter);

app.get('/', function(req, res, next) {
    res.render('index.ejs')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})