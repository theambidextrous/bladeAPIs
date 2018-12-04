var sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var sequelizeInstance = new sequelize('patahapa_apis', 'patahapa_connect', 'deli@#4f45DFveries', {
    host: '108.179.223.30',
    dialect: 'mysql',
    port: 3306,
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  
    // SQLite >> android
    storage: 'sqlite/database.sqlite'
  });
//<< users vparams >>
  var User = sequelizeInstance.define('users', {
    username: {
        type: sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
});
User.beforeCreate = function (user){
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(user.password, salt);
    }
  
User.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.password);
    }

// create all the defined tables in the specified database.
sequelizeInstance.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

module.exports = User;