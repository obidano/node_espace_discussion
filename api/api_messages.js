require('log-timestamp');
require("dotenv").config();
const {insert_message_sql} = require("../db/init_db");
const url = require("url");
//const sqlite = require('sqlite3').verbose()


const {DB_NAME} = process.env;
let sql;

const db =""/* new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})*/


const insert_message = (data) => new Promise(async (resolve, reject) => {
    const {
        message, espace_id, sender_id
    } = data;

    db.run(insert_message_sql, [message, espace_id, sender_id], function (err) {
        if (err) reject(err)
        resolve(this)
    });
})

const select_message = (id) => new Promise((resolve, reject) => {
    sql = "SELECT a.message, a.time,a.sender_id as 'sender_id', " +
        "b.identifiant as 'senderName'," +
        " c.name as 'espaceName', c.ID as 'espace_id' " +
        "FROM message as a " +
        " inner join user as b on a.sender_id=b.id" +
        " inner join espaces as c on a.espace_id=c.id " +
        " where a.id=?"
    console.log("sql", sql)
    db.all(sql, [id], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})
const select_messages = (espace_id) => new Promise((resolve, reject) => {
    sql ="SELECT a.message, a.time,a.sender_id as 'sender_id', " +
        "b.identifiant as 'senderName'," +
        " c.name as 'espaceName', c.ID as 'espace_id' " +
        "FROM message as a " +
        " inner join user as b on a.sender_id=b.id" +
        " inner join espaces as c on a.espace_id=c.id " +
        " where a.espace_id=?"
    db.all(sql, [espace_id], async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
    })
})

const api_get_messages = async (req, res) => {
    /*const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)
    const {espace_id} = req.query*/

    try {
     /*   const rows = await select_messages(espace_id);
        if (rows.length < 1) return res.status(400).send({error: "Liste vide"})
        res.send(rows)*/
        res.send([])

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}


const api_create_message = async (req, res) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log("req body", req.body)

    try {
       /* const {espace_id} = req.body;
        const {lastID} = await insert_message(req.body)
        const row = await select_message(lastID);
        const new_message = row[0]*/
        res.io.in(`espace_1`).emit("new_message", req.body)

        res.status(201).send({msg: "Message enregistré avec succès", message: new_message})

    } catch (e) {
        const status_code = e.status || 400
        res.status(status_code).send({error: e})
    }
}


module.exports = {
    api_create_message,
    api_get_messages
}