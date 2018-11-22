const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
//welcome route - unprotected
app.get('/api', (req, res) => {
    res.json({
        message: 'Wel come to Byteblade Systems API'
    });
});
//api posts - secured
app.post('/api/auth', (req, res) =>{
 res.json({
     message: 'Access granted'
 });
});
// get token
app.post('/api/accesstoken', (req, res) =>{
    //dummy user
    const user = {
        id:43533,
        username:'bladeApis',
        email:'bladeapis@bladeapis.com'
    }
jwt.sign({user}, 'bladescrettokengen', (err, token) =>{
    res.json({
        token
    });
});
});
app.listen(3000, () =>{
    console.log('Server is on')
});