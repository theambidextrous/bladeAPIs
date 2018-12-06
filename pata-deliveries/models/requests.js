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
  var Requests = sequelizeInstance.define('requests', {
    name: {
        type: sequelize.STRING,
        unique: false,
        allowNull: false
    },
    email: {
        type: sequelize.INTEGER,
        unique: true,
        allowNull: false
    },
    phone: {
        type: sequelize.STRING,
        unique: true,
        allowNull: false
    },
    address: {
        type: sequelize.STRING,
        allowNull: false
    },
    weight: {
        type: sequelize.FLOAT,
        allowNull: false
    },
    volumetric_weight:{
        type:sequelize.FLOAT,
        allowNull:false
    },
    latitude:{
        type:sequelize.STRING,
        allowNull:false
    },
    longtude:{
        type:sequelize.STRING,
        allowNull:false
    },
    status:{
        type:sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
    }
});
// create all the defined tables in the specified database.
sequelizeInstance.sync()
    .then(() => console.log('Requests table loaded'))
    .catch(error => console.log('This error occured', error));

module.exports = Requests;