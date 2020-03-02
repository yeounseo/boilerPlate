const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://adminUser:qwer1234@youtubeclone-mwkd4.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

app.get('/', function (req, res) {
    res.send('hello node!');
});

app.listen(port, () => console.log(`Example  app listening on port ${port}`));