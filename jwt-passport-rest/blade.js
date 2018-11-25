//env to be number one
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.get('/', (req, res) =>{
 res.json({
    Greetings: 'Hallo Bro'
 });
});

const port = process.env.port || 5000;
app.listen(port);