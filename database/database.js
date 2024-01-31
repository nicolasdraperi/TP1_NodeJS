const mariadb = require("mariadb")
require('dotenv').config()


const pool = mariadb.createPool({
    host: process.env.HOST,
    database:process.env.DATABASE,
    user:process.env.USER,
    password:process.env.PASSWORD,
    port:process.env.PORT
})


module.exports=pool



