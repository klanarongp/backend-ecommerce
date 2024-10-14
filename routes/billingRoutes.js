// routes/billing.js
const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// GET all billing records (ต้องการการยืนยันตัวตน)
router.get('/', authenticateToken, authorizeAdmin, billingController.getAllBillingRecords);

// POST a new billing record (ต้องการการยืนยันตัวตน)
router.post('/', authenticateToken, billingController.createBillingRecord);

// DELETE a billing record by order_id (ต้องการการยืนยันตัวตน)
router.delete('/:order_id', authenticateToken, authorizeAdmin, billingController.deleteBillingRecord);

module.exports = router;
