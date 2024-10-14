const connection = require('../db');
const { body, validationResult } = require('express-validator');

// Get all addresses
exports.getAllAddresses = (req, res) => {
    connection.query('SELECT * FROM address', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงที่อยู่', error: err });
        }
        res.status(200).json(results);
    });
};

exports.createAddress = [
    // Validate request body
    body('email')
        .custom((value) => {
            // Regex สำหรับตรวจสอบอีเมล
            const validEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
            if (!validEmailPattern.test(value)) {
                throw new Error('Email is required and must be valid');
            }
            return true; // ถ้าอีเมลถูกต้อง
        }),
    body('street_address').notEmpty().withMessage('Street address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('postal_code').notEmpty().withMessage('Postal code is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),

    // Handle the request
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, street_address, city, state, postal_code, country, phone } = req.body;
        const sql = 'INSERT INTO address (email, street_address, city, state, postal_code, country, phone) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [email, street_address, city, state, postal_code, country, phone], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างที่อยู่', error: err });
            }
            res.status(201).json({ message: 'ที่อยู่ถูกสร้างเรียบร้อยแล้ว!', id: result.insertId });
        });
    }
];

// Delete an address by email
exports.deleteAddress = (req, res) => {
    const { email } = req.params;
    const sql = 'DELETE FROM address WHERE email = ?';
    connection.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบที่อยู่', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบที่อยู่ที่ต้องการลบ' });
        }
        res.status(200).json({ message: 'ที่อยู่ถูกลบเรียบร้อยแล้ว!' });
    });
};
