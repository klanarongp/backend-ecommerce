const express = require('express');
const router = express.Router();
const promotionMappingController = require('../controllers/promotionMappingController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware'); 

// GET 
router.get('/', authenticateToken, promotionMappingController.getAllPromotionMappings);

// POST a
router.post('/', authenticateToken, authorizeAdmin, promotionMappingController.createPromotionMapping);

// PATCH 
router.patch('/:promotion_id/:product_id', authenticateToken, authorizeAdmin, promotionMappingController.updatePromotionMapping);

// DELETE
router.delete('/:promotion_id/:product_id', authenticateToken, authorizeAdmin, promotionMappingController.deletePromotionMapping);

module.exports = router;
