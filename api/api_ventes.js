require('log-timestamp');
require("dotenv").config();

const sqlite = require('sqlite3').verbose()
const url = require("url");
const {insert_ventes_sql} = require("../db/init_db");
const {articles} = require("../utils/constantes");

const {DB_NAME} = process.env;


const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const select_vente = () => new Promise((resolve, reject) => {
    sql = "SELECT * FROM ventes"
    db.all(sql, [], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const insert_vente = (user_id, data) => new Promise(async (resolve, reject) => {
    const {
        produit, prix, quantite, longitude, latitude, status
    } = data;
    console.log(user_id, data)

    db.run(insert_ventes_sql, [produit, prix, quantite,
        longitude, latitude, "En attente", user_id], function (err) {
        if (err) reject(err)
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

const api_get_vente_v1 = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const rows = await select_vente();
        if (rows.length < 1) return res.status(400).send({error: "Liste agents vide"})
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
        if (rows.length < 1) return res.status(400).send({error: "Liste agents vide"})
        res.send(rows)

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

module.exports = {
    api_create_vente, api_get_vente_v1, api_get_vente_v2
}