const create_sql = `
CREATE TABLE IF NOT EXISTS user(ID INTEGER PRIMARY KEY, 
                                username VARCHAR, 
                                password VARCHAR
                               );
CREATE TABLE IF NOT EXISTS agent(ID INTEGER PRIMARY KEY, 
                                nom VARCHAR, 
                                age INTEGER,  
                                salaire_brut INTEGER, 
                                is_etranger INTEGER ,
                                dons INTEGER,
                                pays VARCHAR);
                                
                                
                                
                                `
const insert_agent_sql = `INSERT INTO agent (nom,age,  salaire_brut,is_etranger,dons,pays)
                  VALUES (?,?,?,?,?,?)`

const insert_user_sql = `INSERT INTO user (username,password)
                  VALUES (?,?)`
//db.run(sql)
module.exports = {
    create_sql,
    insert_agent_sql,
    insert_user_sql
};