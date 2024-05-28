const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const URI = 'mongodb+srv://sa:123@mongodbpractice123.zxtp6fe.mongodb.net/shopDatabase987?w=majority&appName=mongoDBPractice123'

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

async function main() {
    app.listen(8080);
    await mongoose.connect(URI);
}

main().catch(err => console.log(err));