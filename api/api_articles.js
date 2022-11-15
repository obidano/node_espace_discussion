require('log-timestamp');

const url = require("url");
const {articles} = require("../utils/constantes");


const api_articles = (req, res, next) => {
    const url_info = url.parse(req.url, true)
    console.log("URL", url_info.path)
    res.send(articles)
}

module.exports = {
    api_articles,
}