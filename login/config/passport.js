var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbpool = mysql.createPool({
    connectionLimit:50,
    host: 'albaandassociates.com',
    user: 'alba_website',
    password: ',cqIgM8}76TR&',
    database: 'alba_website'
});
module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(user, done){
        dbpool.getConnection(function(err, connection){
            if(err){ throw err;}else{console.log('connected')}
            connection.query('select * from users where id = ? ', [id], function(err, rows){
                done(err, rows);
                connection.release();
            });
        });
      
    });
    passport.use(
        'local-signup',
        new LocalStrategy({
         usernameField : 'username',
         passwordField: 'password',
         passReqToCallback: true
        },
        function(req, username, password, done){
            dbpool.getConnection(function(err, connection){
                if(err) throw err;
                connection.query("SELECT * FROM users WHERE username = ? ", 
                [username], function(err, rows){
                 if(err)
                  return done(err);
                 if(rows.length){
                  return done(null, false, req.flash('signupMessage', 'That is already taken'));
                 }else{
                  var newUserMysql = {
                   username: username,
                   password: bcrypt.hashSync(password, null, null)
                  };
             
                  var insertQuery = "INSERT INTO users (username, password) values (?, ?)";
             
                  connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
                   function(err, rows){
                       connection.release();
                    newUserMysql.id = rows.insertId;
             
                    return done(null, newUserMysql);
                   });
                 }
                });
            });
        })
       );
      
       passport.use(
        'local-login',
        new LocalStrategy({
         usernameField : 'username',
         passwordField: 'password',
         passReqToCallback: true
        },
        function(req, username, password, done){
        dbpool.getConnection(function(err, connection){
            if(err) throw err;
            connection.query("SELECT * FROM users WHERE username = ? ", [username],
            function(err, rows){
             if(err)
              return done(err);
             if(!rows.length){
              return done(null, false, req.flash('loginMessage', 'No User Found'));
             }
             if(!bcrypt.compareSync(password, rows[0].password))
              return done(null, false, req.flash('loginMessage', 'Wrong Password'));
         
             return done(null, rows[0]);
            });
        })
        })
       );
      };