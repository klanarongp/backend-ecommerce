const express = require('express'); 
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });


router.get('/onsale', productController.getOnSaleProduct);


router.get('/', productController.getAllProduct);


router.get('/:id', productController.getProductById);


router.post('/', upload.single('img'), productController.createProduct);


router.put('/:id', upload.single('img'), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);




module.exports = router;
