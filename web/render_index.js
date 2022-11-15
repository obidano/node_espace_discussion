const {parse} = require("url");


const default_render = (req, res) => {
    const url_info = parse(req.url, true)
    console.log("URL", url_info.path)

    res.send({message: "Welcome to my ODC API Portal"})
}

const r_index = (req, res) => {
    res.render('index', {title: 'ODC'})
}


module.exports = {
    r_index
}