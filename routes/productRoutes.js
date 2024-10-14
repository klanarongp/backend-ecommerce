const express = require('express'); 
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// ตั้งค่าการเก็บไฟล์ภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// เส้นทางสำหรับดึงข้อมูลสินค้าลดราคา
router.get('/onsale', productController.getOnSaleProduct);

// เส้นทางสำหรับดึงข้อมูลผลิตภัณฑ์ทั้งหมด
router.get('/', productController.getAllProduct);

// เส้นทางสำหรับดึงข้อมูลผลิตภัณฑ์ตาม ID
router.get('/:id', productController.getProductById);

// เส้นทางสำหรับสร้างผลิตภัณฑ์ใหม่ (ต้องการการยืนยันตัวตนและเป็น admin)
router.post('/', upload.single('img'), productController.createProduct);

// เส้นทางสำหรับอัปเดตผลิตภัณฑ์ (ต้องการการยืนยันตัวตนและเป็น admin)
router.put('/:id', upload.single('img'), productController.updateProduct);

// เส้นทางสำหรับลบผลิตภัณฑ์ (ต้องการการยืนยันตัวตนและเป็น admin)
router.delete('/:id', productController.deleteProduct);




module.exports = router;
