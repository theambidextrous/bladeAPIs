//what we need
const express = require('express');
const bodyparser = require('body-parser');
//our app
const app = express();

//accept content type
//1. urlencoded
app.use(bodyparser.urlencoded({extended: true}));
//2. json
app.use(bodyparser.json());
//connect to db use mongoose
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true 
}).then(() => {
    console.log('connection done!!!');
}).catch( err =>{
    console.log('db connection failed: ', err);
    process.exit();
});
//entry point route
app.get('/', (req, res) => {
 res.json({"Message": "Welcome to Easynotes, create notes quickly"});
});

//include routes
require('./app/routes/note.routes.js')(app);
//listen to server activities
app.listen(3000, () => {
    console.log("Server is up on port 3000");
});