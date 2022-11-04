// const sqlite = require('sqlite3').verbose()
// const db = new sqlite.Database("./my.db", sqlite.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err)
// })

const create_sql = `CREATE TABLE IF NOT EXISTS agent(ID INTEGER PRIMARY KEY, 
                                nom VARCHAR, 
                                age INTEGER,  
                                salaire_brut INTEGER, 
                                is_etranger INTEGER ,
                                dons INTEGER,
                                pays VARCHAR)`
const insert_sql = `INSERT INTO agent (nom,age,  salaire_brut,is_etranger,dons,pays)
                  VALUES (?,?,?,?,?,?)`
//db.run(sql)
module.exports = {
    create_sql,
    insert_sql
};