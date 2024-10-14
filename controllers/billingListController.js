const connection = require('../db');

// GET ข้อมูล billing list ทั้งหมด
exports.getAllBillingLists = (req, res) => {
    connection.query('SELECT * FROM billing_list', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล billing list', error: err });
        }
        res.status(200).json(results);
    });
};

// POST สร้าง billing list ใหม่
exports.createBillingList = (req, res) => {
    const { product_id, order_id, unit, price, total_price, quantity } = req.body;
    
    // Validate required fields
    if (!product_id || !order_id || !unit || !price || !total_price || !quantity) {
        return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน' });
    }

    const sql = 'INSERT INTO billing_list (product_id, order_id, unit, price, total_price, quantity) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(sql, [product_id, order_id, unit, price, total_price, quantity], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง billing list', error: err });
        }
        res.status(201).json({ message: 'สร้าง billing list สำเร็จ!', id: result.insertId });
    });
};

// DELETE ลบรายการ billing list
exports.deleteBillingList = (req, res) => {
    const { order_id, product_id } = req.params;
    const sql = 'DELETE FROM billing_list WHERE order_id = ? AND product_id = ?';

    connection.query(sql, [order_id, product_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบ billing list', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบรายการ billing list ที่ต้องการลบ' });
        }
        res.status(200).json({ message: 'ลบ billing list สำเร็จ!' });
    });
};
