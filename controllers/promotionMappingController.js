// const connection = require('../db');

// // Get all promotion mappings
// exports.getAllPromotionMappings = (req, res) => {
//     connection.query('SELECT * FROM promotion_mapping', (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching promotion mappings', error: err });
//         }
//         res.status(200).json(results);
//     });
// };

// // Create a new promotion mapping
// exports.createPromotionMapping = (req, res) => {
//     const { promotion_id, product_id, status, discount_percentage } = req.body; 
    
//     // ตรวจสอบข้อมูลก่อนสร้าง
//     if (!promotion_id || !product_id || !status || discount_percentage === undefined) {
//         return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const sql = 'INSERT INTO promotion_mapping (promotion_id, product_id, status, discount_percentage) VALUES (?, ?, ?, ?)';
//     connection.query(sql, [promotion_id, product_id, status, discount_percentage], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง promotion mapping', error: err });
//         }
//         res.status(201).json({ message: 'สร้าง promotion mapping สำเร็จ!', id: result.insertId });
//     });
// };

// // Update a promotion mapping
// exports.updatePromotionMapping = (req, res) => {
//     const { promotion_id, product_id } = req.params;
//     const { status, discount_percentage } = req.body; 

//     // ตรวจสอบข้อมูลก่อนอัปเดต
//     if (!status && discount_percentage === undefined) {
//         return res.status(400).json({ message: 'Status or discount_percentage is required' });
//     }

//     const sql = 'UPDATE promotion_mapping SET status = ?, discount_percentage = ? WHERE promotion_id = ? AND product_id = ?';
//     connection.query(sql, [status || null, discount_percentage || null, promotion_id, product_id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error updating promotion mapping', error: err });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Promotion mapping not found' });
//         }
//         res.status(200).json({ message: 'Promotion mapping updated successfully!' });
//     });
// };

// // Delete a promotion mapping
// exports.deletePromotionMapping = (req, res) => {
//     const { promotion_id, product_id } = req.params; 
//     const sql = 'DELETE FROM promotion_mapping WHERE promotion_id = ? AND product_id = ?';
//     connection.query(sql, [promotion_id, product_id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error deleting promotion mapping', error: err });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Promotion mapping not found' });
//         }
//         res.status(200).json({ message: 'Promotion mapping deleted successfully!' });
//     });
// };
