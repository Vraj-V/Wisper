const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const secretMessageSchema = new Schema({
    message: {type:String,required :true},
    expiry:{type:Number},
    accessedUsers: [String], // Array to track users who accessed it
    share_url: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("SecretMessage", secretMessageSchema);