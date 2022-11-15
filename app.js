const {api_create_user, api_auth_user} = require("./api/api_user");
const {api_create_agent, api_get_agents_v2, api_get_agents_v1} = require("./api/api_agent");
const {api_pays_v1, api_pays_v2} = require("./api/api_pays");
const {api_taux} = require("./api/api_taux");
const {r_index, r_submit_uid, r_vente_liste} = require("./web/render_html");
const {create_sql} = require("./db/init_db");

require('log-timestamp');
require("dotenv").config();

// modules
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const sqlite = require('sqlite3').verbose()
var path = require('path');
const http = require('http').Server(app)

// attach http server to socket.io
const io = require('socket.io')(http)


// middleware
const auth_mid = require('./middleware')

// env
const {API_PORT, DB_NAME} = process.env;

// db
const db = new sqlite.Database(`./${DB_NAME}`, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
    console.log('Database started...')
})

db.run(create_sql)

// port
const PORT = API_PORT;

// static
const node_path = path.join(__dirname, '/node_modules/')
const boostrap_path = path.join(node_path, 'bootstrap/dist/')
const jquery_path = path.join(node_path, 'jquery/dist/')
const socket_path = path.join(node_path, 'socket.io/client-dist/')
const js_path = path.join(__dirname, '/web/js/')
console.log('js path', js_path)
// console.log(node_path)//
// console.log(boostrap_path)//
app.use('/bootstrap', express.static(boostrap_path));
app.use('/socket', express.static(socket_path));
app.use('/jquery', express.static(jquery_path));
app.use('/js', express.static(js_path));

// ejs
app.set('view engine', 'ejs')
app.set('views', './web/views')

app.use(bodyParser.json())
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', r_index)
app.get('/submit-qr', r_submit_uid)
app.get('/ventes', r_vente_liste)

app.get('/api/taux', auth_mid, api_taux)


app.get('/api/agent/v1', api_get_agents_v1)

app.get('/api/agent/v2', api_get_agents_v2)


app.get('/api/pays/v1', api_pays_v1)

app.get('/api/pays/v2', api_pays_v2)


app.post('/api/agent', api_create_agent)

app.post('/api/auth', api_auth_user)
// create user API
app.post('/api/user', api_create_user)

http.listen(PORT, '0.0.0.0', () => {
    console.log('Server started at port', PORT)
})


// create new connection

const rooms = {}
io.on('connection', (socket) => {
    console.log('Nouveau client')

    socket.on('disconnect', () => {
        console.log("client deconnecté", socket.UID, socket.id)
        rooms[socket.UID] = false

    })

    socket.on('checkSession', (roomID) => {
        console.log('checkSession', roomID)
        if (roomID in rooms) {
            console.log("checkSession", roomID)
            io.in(roomID).emit("checkMySession", true);
        } else {
            socket.emit('error', "Cet identifiant n'existe pas ou n'est plus connecté")
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