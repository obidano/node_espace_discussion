$(document).ready(() => {
    const socket_id = uid
    console.log('Copiez votre identifiant de session', socket_id)

    const socket = io()

    socket.on('server', (msg) => {
        // console.log("Message server", msg)
    })

    socket.on("checkMySession", (token) => {
        console.log("redirection", token)
        if (token) {
            localStorage.setItem('token', token)
            window.location.href = '/ventes'
        }
    })

    socket.on('connect', () => {
        console.log("connecté au serveur")
        socket.emit('setRoomId', socket_id);
    })
})