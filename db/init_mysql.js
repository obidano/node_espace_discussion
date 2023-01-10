const create_user_sql = `
CREATE TABLE IF NOT EXISTS user(ID INTEGER unique PRIMARY KEY AUTO_INCREMENT, 
                                identifiant VARCHAR(255));`

const create_espace_sql = `
CREATE TABLE IF NOT EXISTS espaces (ID INTEGER unique PRIMARY KEY AUTO_INCREMENT, 
                                name VARCHAR(255),                            
                                description VARCHAR(255), 
                                creator_id INTEGER  NOT NULL,  
                                 FOREIGN KEY (creator_id)
                            REFERENCES user (id) );    
                                `

const create_messages_sql = `
CREATE TABLE IF NOT EXISTS message (ID INTEGER unique PRIMARY KEY AUTO_INCREMENT, 
                                message VARCHAR(255),                            
                                time VARCHAR(255), 
                                espace_id INTEGER NOT NULL,  
                               sender_id INTEGER NOT NULL,  
                                 FOREIGN KEY (sender_id)
                            REFERENCES user (id) ,
                            FOREIGN KEY (espace_id)
                            REFERENCES espaces (id) 
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