var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connectionPool = mysql.createPool(dbconfig.con);

connectionPool.getConnection(function(err, connection){
  if(err) throw err;
  connection.query('USE ' + dbconfig.database);
  connection.release();
});

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.id);
 });

 passport.deserializeUser(function(id, done){
  connectionPool.getConnection(function(err, connection){
    if(err) throw err;
    connection.query("SELECT * FROM subscribers WHERE id = ? ", [id],
    function(err, rows){
      done(err, rows[0]);
    });
    connection.release();
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
   connectionPool.getConnection(function(err, connection){
    if(err) throw err;
    connection.query("SELECT * FROM subscribers WHERE username = ? ", 
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

     var insertQuery = "INSERT INTO subscribers (username, password) values (?, ?)";

     connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
      function(err, rows){
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
   });
   connection.release();
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
    connectionPool.getConnection(function(err, connection){
      connection.query("SELECT * FROM subscribers WHERE username = ? ", [username],
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
      connection.release();
    });
  })
 );
};