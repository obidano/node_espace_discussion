require('log-timestamp');

const url = require("url");
const {countries} = require("../utils/constantes");


const api_pays_v1 = (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    res.send([countries.CGO, countries.BELGIQUE, countries.USA, countries.FRANCE])
}

const api_pays_v2 = (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)

    res.send({"1": countries.CGO, "2": countries.BELGIQUE, "3": countries.USA, "4": countries.FRANCE})
}

module.exports = {
    api_pays_v1,
    api_pays_v2,
}