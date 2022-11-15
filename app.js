const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const {create_sql} = require("./db/init_db");
const url = require('url')
const auth_mid = require('./middleware')
require('log-timestamp');
const {api_create_user, api_auth_user} = require("./api/api_user");
const {api_create_agent, api_get_agents_v2, api_get_agents_v1} = require("./api/api_agent");
const {api_pays_v1, api_pays_v2} = require("./api/api_pays");
const {api_taux} = require("./api/api_taux");
require("dotenv").config();
const {API_PORT, DB_NAME} = process.env;
let sql;

// db
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
    console.log('Database started...')
})

db.run(create_sql)


const PORT = API_PORT;

app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    try {
        res.send({message: "Welcome to my ODC API Portal"})
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({error: e})
    }
})

app.get('/api/taux', auth_mid, api_taux)


app.get('/api/agent/v1', api_get_agents_v1)

app.get('/api/agent/v2', api_get_agents_v2)


app.get('/api/pays/v1', api_pays_v1)

app.get('/api/pays/v2', api_pays_v2)


app.post('/api/agent', api_create_agent)

app.post('/api/auth', api_auth_user)
// create user API
app.post('/api/user', api_create_user)

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server started at port', PORT)
})
