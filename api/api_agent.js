require('log-timestamp');
require("dotenv").config();

const sqlite = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const url = require("url");
const {insert_agent_sql} = require("../db/init_db");

const {DB_NAME, APP_KEY, SALT, EXPIRATION_TIME} = process.env;


const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
    console.log('Database started...')
})

const select_agent = () => new Promise((resolve, reject) => {
    sql = "SELECT * FROM agent"

    db.all(sql, [], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const insert_agent = (data) => new Promise(async (resolve, reject) => {
    const {nom, age, salaire_brut, is_etranger, dons, pays} = req.body;

    db.run(insert_agent_sql, [nom, age, salaire_brut, is_etranger, dons, pays], function (err) {
        if (err) reject(err)
        resolve(this)
    });
})


const api_create_agent = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        await insert_agent(req.body)
        res.status(201).send({msg: "Agent créé avec succès"})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_agents_v1 = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_agent();
        if (rows.length < 1) return res.status(400).send({error: "Liste agents vide"})
        res.send({data: rows})
    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_agents_v2 = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_agent();
        if (rows.length < 1) return res.status(400).send({error: "Liste agents vide"})
        res.send(rows)

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

module.exports = {
    api_create_agent,
    api_get_agents_v1,
    api_get_agents_v2
}