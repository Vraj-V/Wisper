const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const confessionSchema = new Schema({
    date: { type: String, required: true },
    confessor_status: { type: String, required: true },
    content: { type: String, required: true },
})

module.exports = mongoose.model("Confession", confessionSchema);