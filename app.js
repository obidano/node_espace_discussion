const {api_create_user, api_auth_user} = require("./api/api_user");
const {
    api_create_vente,
    api_get_vente_v2,
    api_get_vente_v1,
    api_update_vente,
    api_get_my_vente
} = require("./api/api_ventes");
const {r_index, r_submit_uid, r_vente_liste, r_submit_envoie_client} = require("./web/render_html");
const {create_user_sql, create_ventes_sql, create_locataires_sql} = require("./db/init_db");

require('log-timestamp');
require("dotenv").config();

// modules
const jwt = require("jsonwebtoken");
const {APP_KEY} = process.env;
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const sqlite = require('sqlite3').verbose()
var path = require('path');
const http = require('http').Server(app)

// env
const {API_PORT, DB_NAME} = process.env;

// db
const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
    console.log('Database started...')

    db.run(create_locataires_sql, [], (err) => {
        if (err) console.log('error create_locataires_sql', err)
    })

    db.run(create_user_sql, [], (err) => {
        if (err) console.log('error create_user_sql', err)
    })

    db.run(create_ventes_sql, [], (err) => {
        if (err) console.log('error create_ventes_sql', err)
    })


})


// attach http server to socket.io
const io = require('socket.io')(http)


// middleware
const auth_mid = require('./middleware')
const {api_articles} = require("./api/api_articles");
const {
    api_get_locataire_v1,
    api_get_locataire_v2,
    api_get_my_locataire,
    api_create_locataire,
    api_update_locataire
} = require("./api/api_locataires");

// port
const PORT = API_PORT;

// static
const node_path = path.join(__dirname, '/node_modules/')
const boostrap_path = path.join(node_path, 'bootstrap/dist/')
const jquery_path = path.join(node_path, 'jquery/dist/')
const socket_path = path.join(node_path, 'socket.io/client-dist/')
const js_path = path.join(__dirname, '/web/js/')
const img_path = path.join(__dirname, '/web/img/')
console.log('js path', js_path)
// console.log(node_path)//
// console.log(boostrap_path)//
app.use('/bootstrap', express.static(boostrap_path));
app.use('/socket', express.static(socket_path));
app.use('/jquery', express.static(jquery_path));
app.use('/js', express.static(js_path));
app.use('/img', express.static(img_path));

// ejs
app.set('view engine', 'ejs')
app.set('views', './web/views')

app.use(bodyParser.json())
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', r_index)
app.get('/submit-qr', r_submit_uid)
app.get('/ventes', r_vente_liste)
app.get('/client', r_submit_envoie_client)

app.get('/api/articles', auth_mid, api_articles)


app.get('/api/ventes/v1', auth_mid, api_get_vente_v1)

app.get('/api/ventes/v2', auth_mid, api_get_vente_v2)
app.get('/api/m/ventes', auth_mid, api_get_my_vente)

app.post('/api/vente', auth_mid, api_create_vente)
app.put('/api/vente', auth_mid, api_update_vente)

app.post('/api/auth', api_auth_user)
// create user API
app.post('/api/user', api_create_user)

// locataires
app.get('/api/locataires/v1', api_get_locataire_v1)

app.get('/api/locataires/v2', api_get_locataire_v2)
app.get('/api/m/locataire', api_get_my_locataire)

app.post('/api/locataire', api_create_locataire)
app.put('/api/locataire', api_update_locataire)

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

    socket.on('setRoomId', function (uId) {
        rooms[uId] = true
        socket.UID = uId
        console.log('room', uId)
        socket.join(uId);
    });

    // socket.emit('server', "welcome")


})