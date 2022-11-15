const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const {create_sql, insert_agent_sql} = require("./db/init_db");
const url = require('url')
const bcrypt = require('bcryptjs')
const {default_password, default_login} = require("./utils/constantes");
require('log-timestamp'); //
require("dotenv").config();
const {API_PORT, DB_NAME, APP_KEY, SALT} = process.env;
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

app.get('/api/taux', (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    const queryObject = url.parse(req.url, true).query
    console.log("url params", queryObject)

    if (queryObject.type === "NAT") {
        return res.send({data: {'IPR': 0.3, 'INSS': 0.16}})
    }
    if (queryObject.type === "EXPAT") {
        return res.send({data: {'IPR': 0.35, 'INSS': 0.16}})
    }
    return res.status(400).send({error: "Type d'agent non reconnu"})
})


app.get('/api/agent/v1', (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    sql = "SELECT * FROM agent"

    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(400).send({error: err})
            if (rows.length < 1) return res.status(400).send({error: "Liste agents vide"})
            res.send({data: rows})
        })
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({error: e})
    }
})

app.get('/api/agent/v2', (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    sql = "SELECT * FROM agent"

    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(400).send({error: err})
            if (rows.length < 1) return res.status(400).send({error: "Liste agents vide"})
            res.send(rows)
        })
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({error: e})
    }
})


const CGO = {id: 1, name: 'RDC', sigle: 'CGO'};
const Belgique = {id: 2, name: 'Belgique', sigle: 'BEG'};
const USA = {id: 3, name: 'USA', sigle: 'USA'};
const FRANCE = {id: 4, name: 'France', sigle: 'FR'};

app.get('/api/pays/v1', (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    res.send([CGO, Belgique, USA, FRANCE])
})

app.get('/api/pays/v2', (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    res.send({"1": CGO, "2": Belgique, "3": USA, "4": FRANCE})
})


app.post('/api/agent', (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const {nom, age, salaire_brut, is_etranger, dons, pays} = req.body;
        db.run(insert_agent_sql, [nom, age, salaire_brut, is_etranger, dons, pays], (err) => {
            if (err) return res.status(400).send({error: err})
            console.log("Enregistrement agent reussi")
        })
        res.status(201).send({msg: "Enregistrement reussi"})
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({error: err})
    }
})

app.post('/api/auth', async (req, res, next) => {
    const {login, password} = req.body;
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    await new Promise(r => setTimeout(r, 500));

    if (default_login === login && default_password === password) {
        return res.status(200).send({msg: "Authentification reussie"})
    }
    return res.status(400).send({error: "Echec authentification"})
})

app.post('/api/user', (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const {username, password, confirm_password} = req.body;

        if (password !== confirm_password) {
            res.status(400).send({error: 'Les mots de passe ne correspondent pas'})
        }
        console.log('pppp')
        sql = "SELECT * FROM user where username = ?"

        try {
            db.all(sql, [username], async (err, rows) => {
                if (err) return res.status(400).send({error: err})
                if (rows.length >= 1) return res.status(400).send({error: "Cet utilisateur existe deja"})
                console.log('salt', SALT)
                const encryptedPassword = await bcrypt.hash(password, SALT);

                db.run(insert_agent_sql, [nom, age, salaire_brut, is_etranger, dons, pays], (err) => {
                    if (err) return res.status(400).send({error: err})
                    console.log("Enregistrement agent reussi")
                })

                console.log('encryptedPassword', encryptedPassword)
                res.send({msg: "Utilisateur créé avec succès"})
            })
        } catch (e) {
            const status_code = e.status || 500
            res.status(status_code).send({error: e})
        }


        /*  db.run(insert_sql, [nom, age, salaire_brut, is_etranger, dons, pays], (err) => {
              if (err) return res.status(400).send({error: err})
              console.log("Enregistrement agent reussi")
          })
          res.status(201).send({msg: "Enregistrement reussi"})*/
    } catch (e) {
        const status_code = e.status || 500
        res.status(status_code).send({error: err})
    }
})

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server started at port', PORT)
})
