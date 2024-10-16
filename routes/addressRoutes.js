const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticate = require('../middleware/authenticate'); // middleware for authentication


router.put('/:email', addressController.updateAddress);
// GET all addresses
router.get('/', authenticate, addressController.getAllAddresses);

// POST a new address
router.post('/', authenticate, addressController.createAddress);

// DELETE an address by email
router.delete('/:email',  addressController.deleteAddress);



module.exports = router;
