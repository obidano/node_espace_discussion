

const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database("./my.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})