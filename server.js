const express = require("express");

const server = express();

server.use(express.json());        // to parse json data  
server.use(express.urlencoded({ extended: true })) // use express.urlencoded to parse incoming requests with payloads
server.set("view engine", "ejs")    // allows us to use the ejs files in the view folder

server.get("/entry", (req,res) => {
    res.render("entry.ejs")
})

server.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
})