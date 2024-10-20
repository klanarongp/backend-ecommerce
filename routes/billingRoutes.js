const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/billing'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`; 
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); 
    }
});

const upload = multer({ storage });

// GET 
router.get('/',  billingController.getAllBillingRecords);

// POST 
router.post('/',  upload.single('img_bill'), authenticateToken,billingController.createBillingRecord);

// DELETE 
router.delete('/:order_id', billingController.deleteBillingRecord);

module.exports = router;
