const mysql = require('mysql2');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "Aryan@1904",
    database: "employe_management"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected");
});

module.exports = connection;