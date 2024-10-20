const express = require('express'); 
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware'); 

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/', userController.getAllUsers);

router.put('/',  userController.updateUser); 

router.delete('/:email',  userController.deleteUser); 

router.put('/resetPassword', userController.resetPassword);

module.exports = router;
