// routes/billingListRoutes.js
const express = require('express');
const router = express.Router();
const billingListController = require('../controllers/billingListController');

// GET ข้อมูล billing list ทั้งหมด
router.get('/', billingListController.getAllBillingLists);

// POST สร้าง billing list ใหม่
router.post('/', billingListController.createBillingList);

// DELETE ลบรายการ billing list
router.delete('/:order_id/:product_id', billingListController.deleteBillingList);

module.exports = router; // ต้องมีการ export router
