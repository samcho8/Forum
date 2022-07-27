const Pool = require("pg").Pool;
const dotenv = require('dotenv').config();

const pool = new Pool({
    user: "postgres",
    password: dotenv["parsed"]["DBPASS"],
    database: "posts",
    host: "localhost",
    port: 5432
});

module.exports = pool;