const mongoose = require("mongoose")

const AuthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: Number,
       
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("auth", AuthSchema)