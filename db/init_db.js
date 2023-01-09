const create_user_sql = `
CREATE TABLE IF NOT EXISTS user(ID INTEGER PRIMARY KEY, 
                                identifiant VARCHAR);`

const create_espace_sql = `
CREATE TABLE IF NOT EXISTS espaces (ID INTEGER PRIMARY KEY, 
                                name VARCHAR,                            
                                description INTEGER, 
                                creator_id INTEGER NOT NULL,  
                                 FOREIGN KEY (creator_id)
                            REFERENCES user (creator_id) );    
                                `

const create_messages_sql = `
CREATE TABLE IF NOT EXISTS message (ID INTEGER PRIMARY KEY, 
                                message TEXT,                            
                                time TEXT, 
                                espace_id INTEGER NOT NULL,  
                               sender_id INTEGER NOT NULL,  
                                 FOREIGN KEY (sender_id)
                            REFERENCES user (sender_id) ,
                            FOREIGN KEY (espace_id)
                            REFERENCES espaces (espace_id) 
                                 );    
                                `
const insert_user_sql = `INSERT INTO user (identifiant) VALUES (?)`
const insert_espace_sql = `INSERT INTO espaces (name,description,creator_id)
                  VALUES (?,?,?)`


const insert_message_sql = `INSERT INTO message (message,time,espace_id, sender_id)
                  VALUES (?,datetime('now'),?, ?)`
//db.run(sql)
module.exports = {
    create_user_sql,
    create_espace_sql,
    create_messages_sql,

    insert_user_sql,
    insert_espace_sql,
    insert_message_sql
};