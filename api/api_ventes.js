require('log-timestamp');
require("dotenv").config();

const sqlite = require('sqlite3').verbose()
const url = require("url");
const {insert_ventes_sql} = require("../db/init_db");
const {articles} = require("../utils/constantes");

const {DB_NAME} = process.env;
let sql;

const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const select_vente = () => new Promise((resolve, reject) => {
    sql = "SELECT a.*, b.username FROM ventes as a INNER JOIN user as b on a.user_id=b.ID "
    db.all(sql, [], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const my_select_vente = (user_id) => new Promise((resolve, reject) => {
    sql = "SELECT a.*, b.username FROM ventes as a INNER JOIN user " +
        "as b on a.user_id=b.ID where b.ID=?"
    db.all(sql, [user_id], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const insert_vente = (user_id, data) => new Promise(async (resolve, reject) => {
    const {
        produit, prix, quantite, longitude, latitude, status
    } = data;
    console.log(user_id, data)

    db.run(insert_ventes_sql, [produit, prix, quantite, longitude, latitude, "En attente", user_id], function (err) {
        if (err) reject(err)
        resolve(this)
    });
})


const update_vente = (id, status) => new Promise(async (resolve, reject) => {
    sql = "UPDATE ventes set status = ? where ID = ?"
    const params = [status, id]
    // console.log("[status, id]", params)
    db.run(sql, params, function (err) {
        if (err) {
            // console.error(err)
            reject(err)
        }
        resolve(this)
    });
})


const api_create_vente = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)
    const {user_id} = req.user

    const {produit, prix} = req.body

    const recherche = articles.find((e) => e['name'] === produit)
    if (!recherche) return res.status(400).send({error: `Article '${produit}' non reconnu `})
    console.log("recherche", recherche)
    if (recherche.prix !== parseInt(prix)) return res.status(400).send({error: `Le prix envoyé ne correspond pas à l'article '${produit}'`})

    try {
        await insert_vente(user_id, req.body)
        res.status(201).send({msg: "Vente enregistrée avec succès"})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_update_vente = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    const {status, id} = req.body
    const vente_id = parseInt(id)

    const avalaible_status = ['Validé', 'Rejeté']
    if (avalaible_status.indexOf(status) === -1)
        return res.status(400).send({error: "Status non valide"})

    try {
        await update_vente(vente_id, status)
        res.status(200).send({msg: "Status modifié avec succès"})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_vente_v1 = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_vente();
        if (rows.length < 1) return res.status(400).send({error: "Liste vente vide"})
        res.send({data: rows})
    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_vente_v2 = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_vente();
        if (rows.length < 1) return res.status(400).send({error: "Liste vente vide"})
        res.send(rows)

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_get_my_vente = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)
    console.log("req user", req.user)

    try {
        const rows = await my_select_vente(req.user.user_id);
        if (rows.length < 1) return res.status(400).send({error: "Liste vente vide"})
        res.send(rows)

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

module.exports = {
    api_create_vente, api_update_vente, api_get_vente_v1, api_get_vente_v2,
    api_get_my_vente
}