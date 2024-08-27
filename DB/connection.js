var mysql = require('mysql');

const con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "erp.vrlabs"
});


module.exports = con;