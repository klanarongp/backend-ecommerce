const express = require('express');
const router = express.Router();
const promotionsController = require('../controllers/promotionsController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// GET all 
router.get('/',  promotionsController.getPromotions);

// POST 
router.post('/',  promotionsController.createPromotion);

// PUT 
router.put('/',  promotionsController.updatePromotion);

// DELETE 
router.delete('/:id',  promotionsController.deletePromotion);

module.exports = router;
