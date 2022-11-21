const ip = require('ip');
const Pool = require('pg').Pool;
// const localhost = String(ip.address());
const localhost = "172.19.0.1";

const pool = new Pool({
    user: "postgres",
    password: "stepan",
    host: localhost,
    port: 5431,
    database: "dbroute"
})

module.exports = pool;
