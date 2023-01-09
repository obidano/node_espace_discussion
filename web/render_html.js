const {parse} = require("url");
const qr = require("qrcode");
const uuid = require('uuid');
let sql;
require('log-timestamp');
const url = require("url");
require("dotenv").config();

const sqlite = require('sqlite3').verbose()

const {DB_NAME} = process.env;


const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const select_ventes = () => new Promise((resolve, reject) => {
    sql = "SELECT a.*, b.username FROM ventes as a INNER JOIN user as b on a.user_id=b.ID "


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
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    try {
        const id = uuid.v4()
        var qr_data = await generate_qrcode(id)
        res.render('index', {
            title: 'ODC | Authentification',
            qr_data, id,
            page: 'home',
        })

    } catch (e) {
        print(e)
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }

}

const r_submit_uid = async (req, res) => {
    try {
        res.render('submit_qr', {
            title: "Formulaire Identifiant session",
            page: 'manuel',
        })
    } catch (e) {
        print(e)
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }

}

const r_submit_envoie_client= async (req, res) => {
    try {
        res.render('send_to_client', {
            title: "Formulaire",
            page: 'manuel',
        })
    } catch (e) {
        print(e)
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }

}

const r_vente_liste = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    try {
        const ventes = await select_ventes()
        //console.log(ventes.length, ventes)
        const colors_choices = {
            "En attente": 'grey',
            "Validé": "green",
            "Rejeté": "red"
        }
        res.render('vente_liste.ejs', {
            title: "Liste des ventes",
            token: req.token,
            page: 'ventes',
            ventes_str: JSON.stringify(ventes),
            ventes: ventes.map((e) => ({
                ...e, 'color': colors_choices[e.status]
            }))
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
    r_vente_liste,
    r_submit_envoie_client
}