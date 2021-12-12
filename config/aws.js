require('dotenv').config({path: "./config/.env"})

module.exports = {
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
}