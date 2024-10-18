const express = require('express'); 
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware'); // นำเข้า authenticateToken และ authorizeAdmin

// เส้นทางสำหรับลงทะเบียนผู้ใช้
router.post('/register', userController.register);

// เส้นทางสำหรับเข้าสู่ระบบ
router.post('/login', userController.login);

// เส้นทางสำหรับดึงข้อมูลผู้ใช้ทั้งหมด (ต้องใช้ authMiddleware)
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers); // เพิ่ม authorizeAdmin เพื่อจำกัดการเข้าถึงเฉพาะ admin

// เส้นทางสำหรับอัปเดตข้อมูลผู้ใช้ (ต้องใช้ authMiddleware)
router.put('/', authenticateToken, userController.updateUser); // เพิ่ม authenticateToken สำหรับการยืนยันตัวตน

// เส้นทางสำหรับลบผู้ใช้ (ต้องใช้ authMiddleware)
router.delete('/:email', authenticateToken, authorizeAdmin, userController.deleteUser); // เพิ่ม authorizeAdmin เพื่อจำกัดการเข้าถึงเฉพาะ admin

router.put('/resetPassword', authenticateToken, userController.resetPassword);

module.exports = router;
