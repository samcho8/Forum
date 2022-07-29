const { Pool } = require("pg");
require("dotenv").config();
const devConfig = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASS,
    database: process.env.PGDATABASE
}

const proConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);


module.exports = pool;

