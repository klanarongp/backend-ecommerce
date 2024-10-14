const express = require('express');
const router = express.Router();
const promotionMappingController = require('../controllers/promotionMappingController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware'); // นำเข้า authMiddleware

// GET all promotion mappings
router.get('/', authenticateToken, promotionMappingController.getAllPromotionMappings);

// POST a new promotion mapping
router.post('/', authenticateToken, authorizeAdmin, promotionMappingController.createPromotionMapping);

// PATCH a promotion mapping (for updating status and discount_percentage)
router.patch('/:promotion_id/:product_id', authenticateToken, authorizeAdmin, promotionMappingController.updatePromotionMapping);

// DELETE a promotion mapping
router.delete('/:promotion_id/:product_id', authenticateToken, authorizeAdmin, promotionMappingController.deletePromotionMapping);

module.exports = router;
