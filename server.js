const express = require("express");
const server = express()
var mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); //for layout boilerplate


server.use(express.json());        // to parse json data  
server.use(express.urlencoded({ extended: true })) // use express.urlencoded to parse incoming requests with payloads

server.engine('ejs', ejsMate) //use ejs server.engine
server.set("view engine", "ejs")    // allows us to use the ejs files in the view folder
server.use(express.static("public"));//to access our public folder

server.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
})

//require passport
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require('connect-flash');

const configDB = require('./config/database.js');
let db;

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
    if (err) return console.log(err)
    db = database
    require('./app/models/routes.js')(server, passport, db);
  }); // connect to our database

// pass passport for configuration
require('./config/passport')(passport);


// required for passport
server.use(session({
    secret: 'journal', // session secret
    resave: true,
    saveUninitialized: true
}));
server.use(passport.initialize());
server.use(passport.session()); // persistent login sessions
server.use(flash()); // use connect-flash for flash messages stored in session