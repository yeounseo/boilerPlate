const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');
// Salt를 이용해서 비밀번호를 암호화할때, Salt를 먼저 생성한다.
// Salt Rounds는 Salt가 몇 글자 인지 나타내는 것 ! 


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
    tokenExp: {
        // 토큰의 유효기간
        type: Number
    }
})


// Mongoose에서 가져온 pre method
// user 정보를 저장하기 전에, 
// 저장하기 전에 함수를 실행하게 만든다.
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        // 작성 해주어야, 다른 정보를 변경 했을때, 넘어가게 된다.
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    // db의 id를 가져온다. => _id
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // User id를 이용해서 User를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })

}

const User = mongoose.model('User', userSchema)
// User의 Model 과 Schema 를 작성하고, 아래에는 다른 곳에서도 이용할 수 있게 exports 하였다.

module.exports = { User }