const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        // Trim : 띄어쓰기를 없애준다.
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    toeknExp: {
        // 토큰의 유효기간
        type: Number
    }
})


const User = mongoose.model('User', userSchema)
// User의 Model 과 Schema 를 작성하고, 아래에는 다른 곳에서도 이용할 수 있게 exports 하였다.

module.exports = { User }