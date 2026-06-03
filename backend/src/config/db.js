const {Pool} = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "security_index_trackerdb",
    password: "12345SIT",
    port: 5432,
});

module.exports =  pool;

