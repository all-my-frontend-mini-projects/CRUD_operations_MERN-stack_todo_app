const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }]
})

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;