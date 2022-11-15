const jwt = require("jsonwebtoken");
require("dotenv").config();

const {APP_KEY} = process.env;


const verifyToken = (req, res, next) => {
    console.log('headers', req.headers)
    const token =
        req.headers["authorization"];
    // console.log('token', token)

    if (!token) {
        return res.status(403).send("Token requis");
    }
    try {
        const t = token.split('Bearer ')[1]
        // console.log(token.split('Bearer '), t)
        const decoded = jwt.verify(t, APP_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Token invalide");
    }
    return next();
};

module.exports = verifyToken;