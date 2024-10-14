const connection = require('../db'); // นำเข้า connection จาก db.js
const bcrypt = require('bcrypt'); // สำหรับเข้ารหัสรหัสผ่าน

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้
exports.registerUser = async (email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        connection.query(query, [email, hashedPassword, role], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.insertId);
        });
    });
};

// ฟังก์ชันสำหรับการเข้าสู่ระบบ
exports.findUserByEmail = (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    return new Promise((resolve, reject) => {
        connection.query(query, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
exports.getAllUsers = () => {
    const query = 'SELECT * FROM users';
    
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
exports.updateUser = (email, password, role) => {
    const query = 'UPDATE users SET password = ?, role = ? WHERE email = ?';
    
    return new Promise((resolve, reject) => {
        connection.query(query, [password, role, email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// ฟังก์ชันสำหรับลบผู้ใช้
exports.deleteUser = (email) => {
    const query = 'DELETE FROM users WHERE email = ?';
    
    return new Promise((resolve, reject) => {
        connection.query(query, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};
