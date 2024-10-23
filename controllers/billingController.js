// controllers/billingController.js
// const connection = require('../db');
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/billing'); 
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); 
//     }
// });

// const upload = multer({ storage });

// exports.uploadBillingImage = upload.single('billingImage'); 

// exports.getAllBillingRecords = (req, res) => {
//     connection.query('SELECT b.*, bd.product_id, bd.unit, bd.quantity, b.order_id AS bOrderId, bd.order_id AS bdOrderId, bd.price AS bdPrice, bd.total_price AS bdTotalPrice FROM billing AS b LEFT JOIN billing_detail AS bd ON b.order_id = bd.order_id', (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching billing records', error: err });
//         }
//         let result = [];
//         let arrTemp = { orderId: '', count: -1 };
//         results.map((v, k) => {
//             if (arrTemp.orderId === '' || arrTemp.orderId !== v.bOrderId) {
//                 result.push({
//                     order_id: v.bOrderId,
//                     email: v.email,
//                     promotion_id: v.promotion_id,
//                     amount: v.amount,
//                     price: v.price,
//                     total_price: v.total_price,
//                     status: v.status,
//                     img_bill: v.img_bill ? `http://localhost:3000/${v.img_bill}` : null, // สร้าง URL รูปภาพ
//                     orderDetail: [{
//                         order_id: v.bdOrderId,
//                         product_id: v.product_id,
//                         unit: v.unit,
//                         price: v.bdPrice,
//                         totalPrice: v.bdTotalPrice,
//                         quantity: v.quantity,
//                     }]
//                 });
//                 arrTemp.count++;
//             } else {
//                 result[arrTemp.count].orderDetail.push({
//                     order_id: v.bdOrderId,
//                     product_id: v.product_id,
//                     unit: v.unit,
//                     price: v.bdPrice,
//                     totalPrice: v.bdTotalPrice,
//                     quantity: v.quantity,
//                 });
//             }
//             arrTemp.orderId = v.bOrderId;
//         });
//         console.log(result);
//         res.status(200).json({ message: 'Billing records retrieved successfully', dataBilling: result });
//     });
// };

// // Create a new billing record
// exports.createBillingRecord = (req, res) => {
//     const { email } = req.user;
//     const { promotion_id, amount, vat, price, total_price } = req.body;
//     const imgPath = req.file ? req.file.path : null;

//     const sql = 'INSERT INTO billing (email, promotion_id, amount, vat, price, total_price, img_bill) VALUES (?, ?, ?, ?, ?, ?, ?)';
//     connection.query(sql, [email, promotion_id, amount, vat, price, total_price, imgPath], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error creating billing record', error: err });
//         }
//         const orderId = result.insertId;
//         res.status(201).json({ message: 'Billing record created successfully!', data: {order_id: orderId, email, promotion_id, amount, vat, price, total_price, img_bill: imgPath ? `http://localhost:3000/${imgPath}` : null } }); // สร้าง URL รูปภาพ
//     });
// };

// // Delete a billing record by order_id
// exports.deleteBillingRecord = (req, res) => {
//     const { order_id } = req.params;
//     const sql = 'DELETE FROM billing WHERE order_id = ?';
//     connection.query(sql, [order_id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error deleting billing record', error: err });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Billing record not found' });
//         }
//         res.status(200).json({ message: `Billing record with order_id ${order_id} deleted successfully!` });
//     });
// };



const connection = require('../db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Setup multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/billing'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

// Middleware for error handling
const handleError = (res, error) => {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error });
};

// Function to validate billing data
const validateBillingData = (data) => {
    const errors = [];
    if (!data.promotion_id) errors.push('Promotion ID is required');
    if (data.amount <= 0) errors.push('Amount must be greater than 0');
    if (data.price < 0) errors.push('Price cannot be negative');
    if (data.total_price < 0) errors.push('Total price cannot be negative');
    return errors.length > 0 ? errors : null;
};

// Upload billing image
exports.uploadBillingImage = upload.single('billingImage'); 

// Get all billing records
exports.getAllBillingRecordsAdmin = (req, res) => {
    connection.query('SELECT b.*, bd.product_id, bd.unit, bd.quantity, b.order_id AS bOrderId, bd.order_id AS bdOrderId, bd.price AS bdPrice, bd.total_price AS bdTotalPrice FROM billing AS b LEFT JOIN billing_detail AS bd ON b.order_id = bd.order_id', (err, results) => {
        if (err) return handleError(res, err);
        
        let result = [];
        let arrTemp = { orderId: '', count: -1 };
        results.map((v) => {
            if (arrTemp.orderId === '' || arrTemp.orderId !== v.bOrderId) {
                result.push({
                    order_id: v.bOrderId,
                    email: v.email,
                    promotion_id: v.promotion_id,
                    amount: v.amount,
                    price: v.price,
                    total_price: v.total_price,
                    status: v.status,
                    img_bill: v.img_bill ? `http://localhost:3000/${v.img_bill}` : null,
                    orderDetail: [{
                        order_id: v.bdOrderId,
                        product_id: v.product_id,
                        unit: v.unit,
                        price: v.bdPrice,
                        totalPrice: v.bdTotalPrice,
                        quantity: v.quantity,
                    }]
                });
                arrTemp.count++;
            } else {
                result[arrTemp.count].orderDetail.push({
                    order_id: v.bdOrderId,
                    product_id: v.product_id,
                    unit: v.unit,
                    price: v.bdPrice,
                    totalPrice: v.bdTotalPrice,
                    quantity: v.quantity,
                });
            }
            arrTemp.orderId = v.bOrderId;
        });
        res.status(200).json({ message: 'Billing records retrieved successfully', dataBilling: result });
    });
};

exports.getAllBillingRecordsUser = (req, res) => {
    const { email } = req.user;
    const query = `SELECT 
        b.*, 
        bd.product_id, 
        bd.unit, 
        bd.quantity, 
        b.order_id AS bOrderId, 
        bd.order_id AS bdOrderId, 
        bd.price AS bdPrice, 
        bd.total_price AS bdTotalPrice,
        p.img AS product_img, 
        p.description AS product_description
    FROM 
        billing AS b 
    LEFT JOIN 
        billing_detail AS bd ON b.order_id = bd.order_id
    LEFT JOIN 
        products AS p ON bd.product_id = p.id
    `;
    connection.query(query,[email], (err, results) => {
        if (err) return handleError(res, err);
        
        let result = [];
        let arrTemp = { orderId: '', count: -1 };
        results.map((v) => {
            if (arrTemp.orderId === '' || arrTemp.orderId !== v.bOrderId) {
                result.push({
                    order_id: v.bOrderId,
                    email: v.email,
                    promotion_id: v.promotion_id,
                    amount: v.amount,
                    price: v.price,
                    total_price: v.total_price,
                    status: v.status,
                    img_bill: v.img_bill ? `http://localhost:3000/${v.img_bill}` : null,
                    orderDetail: [{
                        order_id: v.bdOrderId,
                        product_id: v.product_id,
                        unit: v.unit,
                        price: v.bdPrice,
                        totalPrice: v.bdTotalPrice,
                        quantity: v.quantity,
                        product_img: v.product_img ? `http://localhost:3000/${v.product_img}` : null,
                        product_description: v.product_description
                    }]
                });
                arrTemp.count++;
            } else {
                result[arrTemp.count].orderDetail.push({
                    order_id: v.bdOrderId,
                    product_id: v.product_id,
                    unit: v.unit,
                    price: v.bdPrice,
                    totalPrice: v.bdTotalPrice,
                    quantity: v.quantity,
                });
            }
            arrTemp.orderId = v.bOrderId;
        });
        res.status(200).json({ message: 'Billing records retrieved successfully', dataBilling: result });
    });
};


// Create a new billing record
exports.createBillingRecord = (req, res) => {
    const { email } = req.user;
    const { promotion_id, amount, vat, price, total_price } = req.body;
    const imgPath = req.file ? req.file.path : null;

    // Validate billing data
    const validationError = validateBillingData(req.body);
    if (validationError) {
        return res.status(400).json({ message: 'Invalid input', errors: validationError });
    }

    const sql = 'INSERT INTO billing (email, promotion_id, amount, vat, price, total_price, img_bill) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [email, promotion_id, amount, vat, price, total_price, imgPath], (err, result) => {
        if (err) return handleError(res, err);
        
        const orderId = result.insertId;
        res.status(201).json({ 
            message: 'Billing record created successfully!', 
            data: {
                order_id: orderId, 
                email, 
                promotion_id, 
                amount, 
                vat, 
                price, 
                total_price, 
                img_bill: imgPath ? `http://localhost:3000/${imgPath}` : null 
            }
        });
    });
};

// Update billing status
exports.updateBillingStatus = (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    const sql = 'UPDATE billing SET status = ? WHERE order_id = ?';
    connection.query(sql, [status, order_id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Billing record not found' });
        }
        res.status(200).json({ message: 'Billing status updated successfully!' });
    });
};

// Delete a billing record by order_id
exports.deleteBillingRecord = (req, res) => {
    const { order_id } = req.params;
    const sql = 'DELETE FROM billing WHERE order_id = ?';
    connection.query(sql, [order_id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Billing record not found' });
        }
        
        // Optionally delete the uploaded image
        // Note: Ensure to fetch the image path if needed
        const imgPath = ''; // Retrieve the image path from your database if necessary
        if (imgPath) {
            fs.unlink(imgPath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        res.status(200).json({ message: `Billing record with order_id ${order_id} deleted successfully!` });
    });
};
