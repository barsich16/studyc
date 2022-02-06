const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: 16082001,
    host: "localhost",
    port: 5432,
    database: "studyc_db",
});


module.exports = pool
