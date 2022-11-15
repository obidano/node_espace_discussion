const bcrypt = require("bcryptjs")
const myArgs = process.argv.slice(2);
const size = parseInt(myArgs[0])

const salt = async () => await bcrypt.genSalt(size);
salt().then((salt) => {
    console.log('salt', salt)

})


