const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Weakpassword1!",
    database: "posts",
    host: "localhost",
    port: 5432
});

module.exports = pool;