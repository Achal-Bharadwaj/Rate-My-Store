// Importing and destructuring Pool from pg
const { Pool } = require("pg");

// Using Pool to connect with the Rate-My-Store Postgres DB
// Environment variables are loaded from .env file
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Exporting query function
module.exports = {
    query: (text, params) => pool.query(text, params),
};