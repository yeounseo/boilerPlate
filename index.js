const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');

const config = require('./config/key');

// application/x-www-form-urlencoded 을 분석해서 가져올 수 있게 설정
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 을 분석해서 가져올 수 있게 설정
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

app.get('/', function (req, res) {
    res.send('hello nodemon!');
});

app.post('/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client 에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body)
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 요청한 이메일이 있다면, 비밀번호가 같은지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

            // 비밀 번호 까지 같다면, 유저를 위한 토큰을 생성한다.
            // JSON WEB Token이라는 라이브러리를 이용한다.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // token을 저장한다. 어디에 ? 쿠키, 로컬스토리지 등등 여러 곳에 저장할 수 있다. 여기서는 쿠키에 저장  
                // 쿠키에 저장하려면 , cookieParser를 설치해야한다.
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})


app.listen(port, () => console.log(`Example  app listening on port ${port}`));