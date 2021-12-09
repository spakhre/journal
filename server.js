const express = require("express");

const server = express();

erver.use(express.json());        // to parse json data  
server.use(express.urlencoded({ extended: true })) // use express.urlencoded to parse incoming requests with payloads



server.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
})