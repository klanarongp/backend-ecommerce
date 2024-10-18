const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// ตั้งค่า multer สำหรับการอัพโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/billing'); // โฟลเดอร์สำหรับเก็บไฟล์อัพโหลด
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`; // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); // ตั้งชื่อไฟล์
    }
});

const upload = multer({ storage });

// GET all billing records (ต้องการการยืนยันตัวตน)
router.get('/',  billingController.getAllBillingRecords);

// POST a new billing record (ต้องการการยืนยันตัวตน)
router.post('/',  upload.single('img_bill'), authenticateToken,billingController.createBillingRecord);

// DELETE a billing record by order_id (ต้องการการยืนยันตัวตน)
router.delete('/:order_id', billingController.deleteBillingRecord);

module.exports = router;
