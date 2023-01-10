const {api_create_user} = require("./api/api_user_mysql");

const {create_user_sql, create_espace_sql, create_messages_sql} = require("./db/init_mysql");

require('log-timestamp');
require("dotenv").config();

// modules
const jwt = require("jsonwebtoken");
const {APP_KEY} = process.env;
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const mysql = require('mysql2');
var path = require('path');
const http = require('http').Server(app)

// env
const {API_PORT, DB_NAME} = process.env;

// db
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mauFJcuf5dhRMQrjj",
    port: "3310",
    database: 'espace_discussion'

});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    console.log('Database started...')

    db.query(create_user_sql, function (err, results, fields) {
        if (err) console.log('error create_user_sql', err)
    });

    db.query(create_espace_sql, function (err, results, fields) {
        if (err) console.log('error create_user_sql', err)
    });


    db.query(create_messages_sql, [], (err, results, fields) => {
        if (err) console.log('error create_messages_sql', err)
    })

});


// attach http server to socket.io
const io = require('socket.io')(http)
app.use(function (req, res, next) {
    res.io = io;
    next();
});


// middleware
const auth_mid = require('./middleware')
const {api_create_espace, api_get_espaces} = require("./api/api_espaces");
const {api_create_message, api_get_messages} = require("./api/api_messages");

// port
const PORT = API_PORT;


app.use(bodyParser.json())
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));


app.post('/api/user', api_create_user)

app.post('/api/espace', api_create_espace)
app.get('/api/espace', api_get_espaces)

app.post('/api/message', api_create_message)
app.get('/api/messages', api_get_messages)


http.listen(PORT, '0.0.0.0', () => {
    console.log('Server started at port', PORT)
})


// create new connection

const rooms = {}
io.on('connection', (socket) => {
    console.log('Nouveau client')

    socket.on('messageClient', (msg) => {
        console.log("msg client =>", msg)
        socket.broadcast.emit('messageNewClient', msg);

    })

    socket.on('disconnect', () => {
        console.log("client deconnecté", socket.UID, socket.id)
        rooms[socket.UID] = false

    })

    socket.on('updateVente', (msg) => {
        console.log("socket broadcast", msg)
        socket.broadcast.emit('updateVenteNotif', msg);
    })

    socket.on('sendToClient', (msg) => {
        console.log("socket broadcast: sendToClient", msg)
        socket.broadcast.emit('sentFromServer', msg);
    })

    socket.on('checkSessi-on', (sessionData) => {
        const {session, token} = sessionData
        console.log('checkSession', sessionData)
        try {
            jwt.verify(token, APP_KEY);
            if (session in rooms && rooms[session]) {
                console.log("checkSession", sessionData)
                io.in(session).emit("checkMySession", token);
                socket.emit('success', "Authentification reussie")

            } else {
                socket.emit('error', "Cet identifiant n'existe pas ou n'est plus connecté")
            }
        } catch (err) {
            console.log("error", err)
            socket.emit('error', "Le token n'est pas valide")
        }


    })

    socket.on('souscrire', function (uId) {
        console.log('room', uId)
        socket.join("espace_" + uId);
    });

    socket.on('setRoomId', function (uId) {
        rooms[uId] = true
        socket.UID = uId
        console.log('room', uId)
        socket.join(uId);
    });

    // socket.emit('server', "welcome")


})