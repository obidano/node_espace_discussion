const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const {create_sql, insert_sql} = require("./db/init_db");
const url = require('url')
let sql;

// db
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database("./my.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
    console.log('Database started...')
})

db.run(create_sql)


const PORT = 3200;

app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res, next) => {
    console.log("req body", req.body, typeof req.body)
    try {
        res.send({status: 200, message: "Welcome to my API"})
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({status: status_code, success: false})
    }
})


app.get('/agent/v1', (req, res, next) => {
    sql = "SELECT * FROM agent"

    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(400).send({status: 400, success: false, error: err})
            if (rows.length < 1) return res.status(400).send({status: 400, success: false, error: "Liste agents vide"})
            res.send({data: rows})
        })
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({status: status_code, success: false})
    }
})

app.get('/agent/v2', (req, res, next) => {
    sql = "SELECT * FROM agent"

    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(400).send({status: 400, success: false, error: err})
            if (rows.length < 1) return res.status(400).send({status: 400, success: false, error: "Liste agents vide"})
            res.send(rows)
        })
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({status: status_code, success: false})
    }
})

app.post('/agent', (req, res) => {
    console.log("req body", req.body, typeof req.body)
    try {
        const {nom, age, salaire_brut, is_etranger, dons, pays} = req.body;
        db.run(insert_sql, [nom, age, salaire_brut, is_etranger, dons, pays], (err) => {
            if (err) return res.status(400).send({status: 400, success: false, error: err})
            console.log("Enregistrement agent reussi")
        })
        res.status(201).send({status: 201, success: true, msg: "Enregistrement reussi"})
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({status: status_code, success: false})
    }
})


app.listen(PORT, '0.0.0.0', () => {
    console.log('Server started at port', PORT)
})
