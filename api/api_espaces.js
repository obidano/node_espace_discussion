require('log-timestamp');
require("dotenv").config();
const {insert_espace_sql} = require("../db/init_db");
const url = require("url");
const sqlite = require('sqlite3').verbose()


const {DB_NAME} = process.env;
let sql;

const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const select_espace = (name) => new Promise((resolve, reject) => {
    sql = "SELECT* FROM espaces where name=?"
    db.all(sql, [name], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const insert_espace = (data) => new Promise(async (resolve, reject) => {
    const {
        name, description, creator_id
    } = data;

    db.run(insert_espace_sql, [name, description, creator_id], function (err) {
        if (err) reject(err)
        resolve(this)
    });
})

const select_espaces = () => new Promise((resolve, reject) => {
    sql = "SELECT * FROM espaces"
    db.all(sql, [], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const api_get_espaces = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_espaces();
        if (rows.length < 1) return res.status(400).send({error: "Liste vide"})
        res.send(rows)

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}


const api_create_espace = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const {name} = req.body;
        const rows = await select_espace(name);
        if (rows.length >= 1) return res.status(400).send({error: "Cet espace est deja enregistré"})
        await insert_espace(req.body)
        const row = await select_espace(name);
        const new_espace = row[0]
        res.io.emit("new_espace", new_espace)

        res.status(201).send({msg: "Espace enregistré avec succès", espace: new_espace})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}


module.exports = {
    api_create_espace,
    api_get_espaces
}