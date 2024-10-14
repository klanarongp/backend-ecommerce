const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // เปลี่ยนเป็นชื่อผู้ใช้ของคุณ
    password: '', // เปลี่ยนเป็นรหัสผ่านของคุณ
    database: 'web_ecommerce_db' // เปลี่ยนเป็นชื่อฐานข้อมูลของคุณ
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
