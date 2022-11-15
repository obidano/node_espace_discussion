const {parse} = require("url");
const qr = require("qrcode");
const uuid = require('uuid');

require('log-timestamp');
require("dotenv").config();

const sqlite = require('sqlite3').verbose()

const {DB_NAME} = process.env;


const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const select_agent = () => new Promise((resolve, reject) => {
    sql = "SELECT * FROM agent"

    db.all(sql, [], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const generate_qrcode = (data) => new Promise((resolve, reject) => {
    qr.toDataURL(data, (err, src) => {
        if (err) reject(err);
        resolve(src);
    });
})

const default_render = (req, res) => {
    const url_info = parse(req.url, true)
    console.log("URL", url_info.path)

    res.send({message: "Welcome to my ODC API Portal"})
}

const r_index = async (req, res) => {
    try {
        const id = uuid.v4()
        var qr_data = await generate_qrcode(id)
        res.render('index', {title: 'ODC | Authentification', qr_data, id})

    } catch (e) {
        print(e)
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }

}

const r_submit_uid = async (req, res) => {
    try {
        res.render('submit_qr', {title: "Formulaire Identifiant session"})
    } catch (e) {
        print(e)
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }

}

const r_vente_liste = async (req, res) => {
    try {
        const ventes = await select_agent()
        console.log(ventes.length, ventes)
        res.render('vente_liste.ejs', {
            title: "Liste des ventes",
            ventes: ventes, count: ventes.length
        })
    } catch (e) {
        print(e)
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }

}


module.exports = {
    r_index,
    r_submit_uid,
    r_vente_liste
}