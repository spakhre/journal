const express = require("express");

const server = express();

const mongoose = require("mongoose");
const Entry = require("./models/journal");

const connectionString = 'mongodb+srv://dbUser:Journal2021@cluster0.jdzse.mongodb.net/Journal-Entry?retryWrites=true&w=majority';

const userRoutes = require(".routes/routes.js")

//routes for all
server.use(userRoutes)

mongoose.connect(connectionString, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() => {
        console.log("DB connection successful");
    }).catch((error) => {
        console.log("connection error:", error);
    })

server.get('/', (req, res)=>{
    const journal = new Entry({title: 'Today' })
    res.send(journal);
})

server.use(express.json());        // to parse json data  
server.use(express.urlencoded({ extended: true })) // use express.urlencoded to parse incoming requests with payloads


server.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
})