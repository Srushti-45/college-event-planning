const mysql = require("mysql2");

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "college_event_db",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("MySQL Connected Successfully!");

        connection.release();
    }
});

module.exports = db;