require('log-timestamp');
require("dotenv").config();

const sqlite = require('sqlite3').verbose()
const url = require("url");
const {insert_locataire_sql} = require("../db/init_db");
const {articles} = require("../utils/constantes");

const {DB_NAME} = process.env;
let sql;

const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const select_locataire = () => new Promise((resolve, reject) => {
    sql = "SELECT * FROM locataires"
    db.all(sql, [], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const my_select_locataire = (id_loc) => new Promise((resolve, reject) => {
    sql = "SELECT* FROM locataires where b.ID=?"
    db.all(sql, [id_loc], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const insert_locataire = (data) => new Promise(async (resolve, reject) => {
    const {
        nom,nombre,telephone
    } = data;

    db.run(insert_locataire_sql, [nom,nombre,telephone], function (err) {
        if (err) reject(err)
        resolve(this)
    });
})


const update_locataire = (id, nbre) => new Promise(async (resolve, reject) => {
    sql = "UPDATE locataires set nbre = ? where ID = ?"
    const params = [nbre, id]
    db.run(sql, params, function (err) {
        if (err) {
            reject(err)
        }
        resolve(this)
    });
})


const api_create_locataire = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)
    try {
        await insert_locataire( req.body)
        res.status(201).send({msg: "Locataire enregistré avec succès"})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_update_locataire = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    const {nbre, id} = req.body
    const locataire_id = parseInt(id)

    try {
        await update_locataire(locataire_id, nbre)
        res.status(200).send({msg: "Nombre modifié avec succès"})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_locataire_v1 = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_locataire();
        if (rows.length < 1) return res.status(400).send({error: "Liste Locataire vide"})
        res.send({data: rows})
    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_locataire_v2 = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_locataire();
        if (rows.length < 1) return res.status(400).send({error: "Liste locataire vide"})
        res.send(rows)

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_my_locataire = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)
    console.log("req user", req.user)

    try {
        const rows = await my_select_locataire(req.user.user_id);
        if (rows.length < 1) return res.status(400).send({error: "Liste locataire vide"})
        res.send(rows)

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

module.exports = {
     api_create_locataire,  api_update_locataire, api_get_locataire_v1,
    api_get_locataire_v2,
    api_get_my_locataire
}