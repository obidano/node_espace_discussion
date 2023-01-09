const create_user_sql = `
CREATE TABLE IF NOT EXISTS user(ID INTEGER PRIMARY KEY, 
                                username VARCHAR, 
                                password VARCHAR
                               );`

const create_ventes_sql = `
CREATE TABLE IF NOT EXISTS ventes (ID INTEGER PRIMARY KEY, 
                                produit VARCHAR,                            
                                prix INTEGER, 
                                quantite INTEGER, 
                                 longitude VARCHAR, 
                                latitude VARCHAR, 
                                status VARCHAR,
                                user_id INTEGER NOT NULL,  
                                 FOREIGN KEY (user_id)
                            REFERENCES user (user_id) );    
                                `

const create_locataires_sql = `
CREATE TABLE IF NOT EXISTS locataires (ID INTEGER PRIMARY KEY, 
                                nom VARCHAR,                            
                                nombre INTEGER, 
                                telephone VARCHAR
                                 );    
                                `
const insert_ventes_sql = `INSERT INTO ventes (produit,prix,quantite,
                    longitude,latitude,status,user_id)
                  VALUES (?,?,?,?,?,?, ?)`

const insert_user_sql = `INSERT INTO user (username,password)
                  VALUES (?,?)`

const insert_locataire_sql = `INSERT INTO locataires (nom,nombre,telephone)
                  VALUES (?,?, ?)`
//db.run(sql)
module.exports = {
    create_user_sql,
    create_ventes_sql,
    create_locataires_sql,
    insert_ventes_sql,
    insert_user_sql,
    insert_locataire_sql
};