const express = require('express');
const bodyParser = require('body-parser');
//const path = require('path');
const env = require("./src/environments/environment");
const cors = require('cors');
const port = process.argv[2] || 8000;
const app = express();

const dbUtils = require('./src/app/db');
appDb = dbUtils.db(env, 'app')

dbUtils.import_data(appDb)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(port, () => {
    console.log('RestAPI live on port ' + port);
});
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    console.log(req.url, req.method);

    next();
})

require('./src/app/routes')(app, { db: appDb });
