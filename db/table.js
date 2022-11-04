const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database("./my.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const sql = `CREATE TABLE agent(ID INTEGER PRIMARY KEY, 
                                nom VARCHAR, 
                                age INTEGER,  
                                salaire_brut INTEGER, 
                                is_etranger INTEGER ,
                                dons INTEGER,
                                pays VARCHAR)`

db.run(sql)