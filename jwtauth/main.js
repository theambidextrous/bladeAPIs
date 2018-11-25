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
app.post('/api/auth', VerifyToken, (req, res) =>{
    //verify token using jwt
    jwt.verify(req.token, 'bladescrettokengen', (err, Verificationdata) =>{
        if(err){
            //res.sendStatus(403);
            res.json({
                error: err
            })
            console.log(err);
        }else{
            res.json({
                message: 'Access granted',
                Verificationdata
            });  
        }
    });
});
// get token
app.post('/api/accesstoken', (req, res) =>{
    //verify token with jwt
    //dummy user
    const user = {
        id:43533,
        username:'bladeApis',
        email:'bladeapis@bladeapis.com'
    }
jwt.sign({user}, 'bladescrettokengen', {expiresIn: '30s'}, (err, token) =>{
    res.json({
        token
    });
});

});
function VerifyToken(req, res, next){
    //get token <bearer> from headers
    const bearerheaders = req.headers['authorization'];
    //see if is set
    if(typeof bearerheaders !== 'undefined'){
        const cleanheadersArray = bearerheaders.split(' ');
        const BearerToken = cleanheadersArray[1] ;
        req.token = BearerToken;
        //call next
        next();
    }
    else{
    res.sendStatus(403);
    }
}
app.listen(3000, () =>{
    console.log('Server is on')
});