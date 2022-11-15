const {parse} = require("url");
const qr = require("qrcode");
const uuid = require('uuid');

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
        res.render('vente_liste.ejs', {title: "Liste des ventes"})
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