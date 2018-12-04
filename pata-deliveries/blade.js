// this code is run twice
console.log(process.pid);
require('daemon');
console.log(process.pid);
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
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
// check login
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/sys/access/dashboard');
    } else {
        next();
    }    
};

// to home/login page>>>
app.get('/', sessionChecker, (req, res) => {
    res.render('/sys/access', {
        message: "You must be logged in to access this page"
    });
});
// to signup>>>
app.route('/sys/access/join')
    .get(sessionChecker, (req, res) => {
        res.render(__dirname + '/public/register');
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
            res.render('/sys/access/signup', {
                message: "Some fields are empty"
            });
        });
    });
// to Login>>>
app.route('/sys/access')
    .get(sessionChecker, (req, res) => {
        res.render(__dirname + '/public/login');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.render('/sys/access', {
                   message:"Invalid access type" 
                });
            } else if (!user.validPassword(password)) {
                console.log('Wrong password: ' + password);
                res.render('/sys/access', {
                    message:"Wrong login credentials"
                });
            } else {
                req.session.user = user.dataValues;
                console.log('Correct password: ' + password);
                res.redirect('/sys/access/dashboard');
            }
        });
    });
// >>> dashboard
app.get('/sys/access/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render(__dirname + '/public/dashboard');
    } else {
        res.render('/sys/access');
    }
});

// >>> logout route
app.get('/sys/access/exit', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
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