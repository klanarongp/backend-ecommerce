const connection = require('../db');

// GET ข้อมูล billing list พร้อม status
exports.getAllBillingLists = (req, res) => {
    const sql = `
        SELECT bd.*, b.status
        FROM billing_detail AS bd
        LEFT JOIN billing AS b ON bd.order_id = b.order_id
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล billing list', error: err });
        }
        res.status(200).json(results);
    });
};

// POST สร้าง billing list 
exports.createBillingList = (req, res) => {
    const { product_id, order_id, unit, price, total_price, quantity } = req.body;

    // Log request body for debugging
    console.log(req.body);

    if (!product_id || !order_id || !unit || !price || !total_price || !quantity) {
        return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน' });
    }

    const sql = 'INSERT INTO billing_detail (product_id, order_id, unit, price, total_price, quantity) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(sql, [product_id, order_id, unit, price, total_price, quantity], (err, result) => {
        if (err) {
            console.error('Error inserting into billing_detail:', err); // Log the error
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง billing list', error: err });
        }
        res.status(201).json({ message: 'สร้าง billing list สำเร็จ!', id: result.insertId });
    });
};

// DELETE ลบรายการ billing 
exports.deleteBillingList = (req, res) => {
    const { order_id, product_id } = req.params;
    const sql = 'DELETE FROM billing_detail WHERE order_id = ? AND product_id = ?';

    connection.query(sql, [order_id, product_id], (err, result) => {
        if (err) {
            console.error('Error deleting billing_detail:', err); // Log the error
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบ billing list', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบรายการ billing list ที่ต้องการลบ' });
        }
        res.status(200).json({ message: 'ลบ billing list สำเร็จ!' });
    });
};
