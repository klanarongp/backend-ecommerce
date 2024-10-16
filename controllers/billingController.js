// controllers/billingController.js
const connection = require('../db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// ตั้งค่า multer เพื่อเก็บไฟล์ในโฟลเดอร์ที่กำหนด
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/billing'); // กำหนดที่เก็บไฟล์
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
    }
});

const upload = multer({ storage });

// Middleware สำหรับอัพโหลดรูปภาพ
exports.uploadBillingImage = upload.single('billingImage'); // 'billingImage' คือชื่อฟิลด์ในฟอร์มที่ใช้สำหรับอัพโหลด

// Get all billing records
exports.getAllBillingRecords = (req, res) => {
    connection.query('SELECT b.*,bd.product_id,bd.unit,bd.quantity,b.order_id AS bOrderId,bd.order_id AS bdOrderId,bd.price AS bdPrice,bd.total_price AS bdTotalPrice FROM billing AS b LEFT JOIN billing_detail AS bd ON b.order_id = bd.order_id', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching billing records', error: err });
        }
        let result = [];
        let arrTemp = {orderId : '',count : -1};
        results.map((v,k) => {
            if(arrTemp.orderId === '' || arrTemp.orderId !== v.bOrderId){
                result.push({
                    order_id : v.bOrderId,
                    email : v.email,
                    promotion_id : v.promotion_id,
                    amount : v.amount,
                    price : v.price,
                    total_price : v.total_price,
                    status : v.status,
                    img_bill : v.img_bill,
                    orderDetail : [{
                        order_id : v.bdOrderId,
                        product_id : v.product_id,
                        unit : v.unit,
                        price : v.bdPrice,
                        totalPrice : v.bdTotalPrice,
                        quantity : v.quantity,
                    }]
                });
                arrTemp.count++;
            }else{
                result[arrTemp.count].orderDetail.push({
                        order_id : v.bdOrderId,
                        product_id : v.product_id,
                        unit : v.unit,
                        price : v.bdPrice,
                        totalPrice : v.bdTotalPrice,
                        quantity : v.quantity,
                    });
            }
            arrTemp.orderId = v.bOrderId;
        });
        console.log(result);
        res.status(200).json({ message: 'Billing records retrieved successfully', dataBilling: result });
    });
};

// Create a new billing record
exports.createBillingRecord = (req, res) => {
    const { email } = req.user;
    const { promotion_id, amount, vat, price, total_price } = req.body;
    const imgPath = req.file ? req.file.path : null; // รับ path ของไฟล์รูปภาพ

    const sql = 'INSERT INTO billing (email, promotion_id, amount, vat, price, total_price, img_bill) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [email, promotion_id, amount, vat, price, total_price, imgPath], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating billing record', error: err });
        }
        res.status(201).json({ message: 'Billing record created successfully!', data: { email, promotion_id, amount, vat, price, total_price, imgPath } });
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
