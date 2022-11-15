require('log-timestamp');

const url = require("url");


const api_taux = (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    console.log('req quser', req.user)

    const queryObject = url.parse(req.url, true).query
    console.log("url params", queryObject)

    if (queryObject.type === "NAT") {
        return res.send({data: {'IPR': 0.3, 'INSS': 0.16}})
    }
    if (queryObject.type === "EXPAT") {
        return res.send({data: {'IPR': 0.35, 'INSS': 0.16}})
    }
    return res.status(400).send({error: "Type d'agent non reconnu"})
}


module.exports = {
    api_taux,
}