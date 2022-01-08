const mongoose = require('mongoose')

let commandsSchema = new mongoose.Schema({
    Guild: String,
    Cmds: Array
})

module.exports = mongoose.model('cnds', commandsSchema)