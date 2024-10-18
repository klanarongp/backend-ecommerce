const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticate = require('../middleware/authenticate'); // middleware for authentication


router.put('/:email', addressController.updateAddressUser);
router.put('/',authenticate, addressController.updateAddress);
// GET all addresses
router.get('/',  addressController.getAllAddresses);

// POST a new address
router.post('/', addressController.createAddress);

// DELETE an address by email
router.delete('/:email',  addressController.deleteAddress);



module.exports = router;
