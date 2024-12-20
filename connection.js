const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "Yoshi123*",
    database: "tienda_joyas",
    port: 5432,
    allowExitOnIdle: true
});


module.exports = {pool}