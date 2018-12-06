// this code is run twice
console.log(process.pid);
require('daemon');
console.log(process.pid);
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
//models
var User = require('./models/user');
var Request = require('./models/requests');
//end models

//launch express app 
var app = express();
//set public fixed dir
app.use('/public', express.static('public'));
//set templating 
app.set('view engine', 'ejs');
//listen on 
var port = process.env.port || 3000;
// set morgan for debug.
app.use(morgan('dev'));
//format urls
app.use(bodyParser.urlencoded({ extended: true }));
//get browser cookies
app.use(cookieParser());
//track looged in users
app.use(session({
    key: 'user_sid',
    secret: 'iddjumasecretcodeid',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
//detect login/logout
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});
// check login and go to dashboard
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/sys/access/dashboard');
    } else {
        next();
    }    
};

// to landing page >> route => /sys/access, resource => public/login
app.get('/sys/access', sessionChecker, (req, res) => {
    res.render(__dirname + '/public/login', {
        message: "You must be logged in to access this page"
    });
});
// to signup page >> route => /sys/access/join, resource => public/register
app.route('/sys/access/join')
    .get(sessionChecker, (req, res) => {
        res.render(__dirname + '/public/register', {
            message:"Login success"
        });
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/sys/access/dashboard');
        })
        .catch(error => {
            res.redirect('/sys/access/join');
        });
    });
// to Login>>>
app.route('/sys/access')
    .get(sessionChecker, (req, res) => {
        res.render(__dirname + '/public/login', {
            message:"Welcome to Pata deliveries"
        });
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/sys/access');
            } else if (!user.validPassword(password)) {
                console.log('Wrong password: ' + password);
                res.redirect('/sys/access');
            } else {
                req.session.user = user.dataValues;
                console.log('Correct password: ' + password);
                res.redirect('/sys/access/dashboard');
            }
        });
    });
// to dashboard view >> route => /sys/access/join, resource => public/dashboard
app.get('/sys/access/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render(__dirname + '/public/dashboard', {
            message:"Welcome to pata deliveries, monitor delivery requests",
            title:"Pata deliveries dashboard",
            user:req.session.user
        });
    } else {
        res.redirect('/sys/access');
    }
});
//go to realtime maps
app.get('/sys/access/realtime',(req, res)=> {
    if(req.session.user && req.cookies.user_sid){
        res.render(__dirname + '/public/realtime', {
            message:"View your assets in realtime",
            title:"Reatime asset visualization",
            user:req.session.user
        })
    }
});
//>>>>add request
app.route('/sys/access/new-request')
.get(sessionChecker, (req, res) => {
    res.render(__dirname + '/public/new-request', {
        message:"Simulation of service request android app",
        title:"Create new request",
        user:req.session.user
    });
})
.post((req, res) => {
    Request.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        weight: req.body.weight,
        volumetric_weight: req.body.volumetric_weight,
        latitude: req.body.latitude,
        longtude: req.body.longtude,
        status: req.body.status
    })
    .then(user => {
        res.render('/sys/access/new-request', {
            message:"added successfully"
        });
    })
    .catch(error => {
        res.render('/sys/access/new-request', {
            error:error
        });
    });
});
// >>> logout route
app.get('/sys/access/exit', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/sys/access');
    } else {
        res.redirect('/sys/access');
    }
});
// to >>>> 404
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});
// fire express app
app.listen(port, () => console.log(`Server up ${port}`));