// controllers/billingController.js
const connection = require('../db');

// Get all billing records
exports.getAllBillingRecords = (req, res) => {
    connection.query('SELECT * FROM billing', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching billing records', error: err });
        }
        res.status(200).json({ message: 'Billing records retrieved successfully', data: results });
    });
};

// Create a new billing record
exports.createBillingRecord = (req, res) => {
    const { order_id, email, promotion_id, amount, vat, price, total_price } = req.body;
    const sql = 'INSERT INTO billing (order_id, email, promotion_id, amount, vat, price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [order_id, email, promotion_id, amount, vat, price, total_price], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating billing record', error: err });
        }
        res.status(201).json({ message: 'Billing record created successfully!', data: { order_id, email, promotion_id, amount, vat, price, total_price } });
    });
};

// Delete a billing record by order_id
exports.deleteBillingRecord = (req, res) => {
    const { order_id } = req.params;
    const sql = 'DELETE FROM billing WHERE order_id = ?';
    connection.query(sql, [order_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting billing record', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Billing record not found' });
        }
        res.status(200).json({ message: `Billing record with order_id ${order_id} deleted successfully!` });
    });
};
