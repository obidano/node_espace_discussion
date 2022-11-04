const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const {create_sql} = require("./db/init_db");

const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database("./my.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
    console.log('Database started...')
})

db.run(create_sql)


const PORT = 3000;

//app.use(bodyParser.json)
app.use(cors());

app.get('/', (req, res, next) => {
    console.log("req body", req.body, typeof req.body)
    try {
        res.send({status: 200, message: "Welcome to my API"})
       // next()
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({status: status_code, success: false})
        //next()
    }
})

app.post('/agent', (req, res) => {
    console.log("req body", req.body, typeof req.body)
    try {
        return res.json({status: 200, success: true})
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({status: status_code, success: false})
    }
})


app.listen(PORT, '0.0.0.0', () => {
    console.log('Server started at port', PORT)
})
