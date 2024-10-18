const connection = require('../db'); // นำเข้า connection จาก db.js
const bcrypt = require('bcrypt'); // สำหรับเข้ารหัสรหัสผ่าน

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้
exports.registerUser = async (email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        connection.query(query, [email, hashedPassword, role], async (err, results) => {
            if (err) {
                return reject(err);
            }

            // เพิ่มที่อยู่ลงในตาราง address โดยใช้เพียงแค่ email
            try {
                await addAddress(email); // เรียกใช้ฟังก์ชันเพิ่มที่อยู่
            } catch (error) {
                return reject(error);
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

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้พร้อมที่อยู่
exports.getAllUsersWithAddress = () => {
    const query = `
        SELECT users.email, users.role, 
               address.street_address, address.city, address.state, 
               address.postal_code, address.country, address.phone
        FROM users
        LEFT JOIN address ON users.email = address.email
    `;

    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const addAddress = (email) => {
    const query = 'INSERT INTO address (email, street_address, city, state, postal_code, country, phone) VALUES (?, ?, ?, ?, ?, ?, ?)'; // เพิ่มข้อมูลที่อยู่

    // กำหนดค่าเริ่มต้นเป็น '-'
    const defaultAddress = '-', defaultCity = '-', defaultState = '-', defaultPostalCode = '-', defaultCountry = '-', defaultPhone = '-';

    return new Promise((resolve, reject) => {
        connection.query(query, [email, defaultAddress, defaultCity, defaultState, defaultPostalCode, defaultCountry, defaultPhone], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.insertId);
        });
    });
};

// อัปเดตข้อมูลผู้ใช้
exports.updateUser = async (email, newPassword, role) => {
    let query = 'UPDATE users SET role = ?';
    const params = [role];

    if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        query += ', password = ?';
        params.push(hashedPassword);
    }

    query += ' WHERE email = ?';
    params.push(email);

    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// อัปเดตข้อมูลที่อยู่
exports.updateAddress = (email, street_address, city, state, postal_code, country, phone) => {
    const query = `UPDATE address SET 
            street_address = ?, 
            city = ?, 
            state = ?, 
            postal_code = ?, 
            country = ?, 
            phone = ? 
        WHERE email = ?`;

    return new Promise((resolve, reject) => {
        connection.query(query, [street_address, city, state, postal_code, country, phone, email], (err, results) => {
            if (err) {
                return reject(err);
            }
            // หากไม่พบแอดเดรสให้คืนค่า 0
            if (results.affectedRows === 0) {
                return reject(new Error('Address not found.'));
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


exports.updateUserPassword = (email, password) => {
    const query = 'UPDATE users SET password = ? WHERE email = ?';

    return new Promise((resolve, reject) => {
        connection.query(query, [password, email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// ฟังก์ชันสำหรับลบที่อยู่
exports.deleteAddress = (email) => {
    const query = 'DELETE FROM address WHERE email = ?';

    return new Promise((resolve, reject) => {
        connection.query(query, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// ฟังก์ชันสำหรับลบผู้ใช้และที่อยู่
exports.deleteUserWithAddress = async (email) => {
    try {
        // ลบที่อยู่ก่อน
        await this.deleteAddress(email);
        // ลบผู้ใช้
        await this.deleteUser(email);
    } catch (error) {
        throw error; // ส่งต่อข้อผิดพลาด
    }
};