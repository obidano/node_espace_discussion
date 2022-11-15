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
    console.log('Database started...')
})

const select_user = (username) => new Promise((resolve, reject) => {
    sql = "SELECT * FROM user where username = ?"

    db.all(sql, [username], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const insert_user = (username, password) => new Promise(async (resolve, reject) => {
    const encryptedPassword = await bcrypt.hash(password, SALT);
    db.run(insert_user_sql, [username, encryptedPassword], function (err) {
        if (err) reject(err)
        resolve(this)
    });
})


const api_create_user = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const {username, password, confirm_password} = req.body;
        if (password !== confirm_password) {
            res.status(400).send({error: 'Les mots de passe ne correspondent pas'})
        }

        const rows = await select_user(username);
        if (rows.length >= 1) return res.status(400).send({error: "Cet utilisateur existe deja"})

        const {lastID} = await insert_user(username, password)
        const token = jwt.sign(
            {user_id: lastID, username},
            APP_KEY,
            {
                expiresIn: EXPIRATION_TIME,
            }
        );
        res.status(201).send({msg: "Utilisateur créé avec succès", token})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

const api_auth_user = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
        const {username, password} = req.body;
        const rows = await select_user(username);
        if (rows.length === 0) return res.status(400).send({error: "Cet utilisateur n'existe pas"})
        const user = rows[0]

        const pwd_compare = await bcrypt.compare(password, user.password)

        if (!pwd_compare) return res.status(400).send({error: "Mot de passe incorrect"})

        const token = jwt.sign(
            {user_id: user.ID, username},
            APP_KEY,
            {
                expiresIn: EXPIRATION_TIME,
            }
        );
        return res.status(200).send({msg: "Authentification reussie", token: token})


    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}

module.exports = {
    api_create_user,
    api_auth_user
}