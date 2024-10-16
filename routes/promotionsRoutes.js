const express = require('express');
const router = express.Router();
const promotionsController = require('../controllers/promotionsController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// GET all promotions - accessible by all users
router.get('/',  promotionsController.getPromotions);

// POST a new promotion - only accessible by admin
router.post('/',  promotionsController.createPromotion);

// PUT (update) a promotion - only accessible by admin
router.put('/',  promotionsController.updatePromotion);

// DELETE a promotion - only accessible by admin
router.delete('/:id',  promotionsController.deletePromotion);

module.exports = router;
