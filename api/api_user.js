require('log-timestamp');
require("dotenv").config();

const sqlite = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const url = require("url");
const {insert_user_sql} = require("../db/init_db");

const {DB_NAME, APP_KEY, SALT, EXPIRATION_TIME} = process.env;


const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const select_user = (identifiant) => new Promise((resolve, reject) => {
    sql = "SELECT * FROM user where identifiant = ?"

    db.all(sql, [identifiant], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const insert_user = (username) => new Promise(async (resolve, reject) => {
    db.run(insert_user_sql, [username], function (err) {
        if (err) reject(err)
        resolve(this)
    });
})


const api_create_user = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const {identifiant} = req.body;

        const rows = await select_user(identifiant);
        if (rows.length >= 1) return res.status(200).send({msg: "Utilisateur deja enregistré", user: rows[0]})

        const {lastID} = await insert_user(identifiant)
        res.status(201).send({
            msg: "Utilisateur créé avec succès",
            user: {id: lastID, identifiant}
        })

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}



module.exports = {
    api_create_user,
}