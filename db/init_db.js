const create_user_sql = `
CREATE TABLE IF NOT EXISTS user(ID INTEGER PRIMARY KEY, 
                                username VARCHAR, 
                                password VARCHAR
                               );`

const create_ventes_sql = `
CREATE TABLE IF NOT EXISTS ventes (ID INTEGER PRIMARY KEY, 
                                produit VARCHAR,                            
                                prix INTEGER, 
                                 longitude VARCHAR, 
                                latitude VARCHAR, 
                                status VARCHAR,
                                user_id INTEGER NOT NULL,  
                                 FOREIGN KEY (user_id)
                            REFERENCES user (user_id) );    
                                `
const insert_agent_sql = `INSERT INTO agent (nom,age,  salaire_brut,is_etranger,dons,pays)
                  VALUES (?,?,?,?,?,?)`

const insert_user_sql = `INSERT INTO user (username,password)
                  VALUES (?,?)`
//db.run(sql)
module.exports = {
    create_user_sql,
    create_ventes_sql,
    insert_agent_sql,
    insert_user_sql
};