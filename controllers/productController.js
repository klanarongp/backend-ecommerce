const connection = require('../db');
const fs = require('fs');
const path = require('path');

exports.getAllProduct = (req, res) => {
    //const query = `SELECT p.*,IFNULL((p.quantity - b.quantity),0) AS remain_quantity FROM products AS p LEFT JOIN billing_detail AS b ON p.id = b.product_id`;
    const query = `SELECT * FROM products ORDER BY id DESC`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }

        const productsWithImageUrls = results.map(product => {
            return {
                ...product,
                img: `http://localhost:3000/${product.img}`, 
                
            };
        });
        console.log(productsWithImageUrls)
        res.json(productsWithImageUrls);
    });
};

exports.createProduct = (req, res) => {
    const imgPath = req.file ? req.file.path : null;
    const { description, unit, price, size, type, quantity, discount_price, is_on_promotion } = req.body;

    const isOnPromotion = is_on_promotion === 'true' ? 1 : 0;

    connection.query(
        'INSERT INTO products (description, unit, price, img, size, type, quantity, discount_price, is_on_promotion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [description, unit, price, imgPath, size, type, quantity, discount_price, isOnPromotion],
        (err) => {
            if (err) {
                console.error('Error creating product:', err);
                return res.status(500).json({ error: 'Failed to create product' });
            }
            res.status(201).json({ message: 'Product created successfully!' });
        }
    );
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { description, unit, price, size, type, quantity, discount_price, is_on_promotion } = req.body; 
    const imgPath = req.file ? req.file.path : null;

    const isOnPromotion = is_on_promotion === 'true' ? 1 : 0;

    const query = 
        `UPDATE products SET 
        description = ?, 
        unit = ?, 
        price = ?, 
        size = ?, 
        type = ?, 
        quantity = ?, 
        discount_price = ?, 
        is_on_promotion = ?${imgPath ? ', img = ?' : ''}
        WHERE id = ?;`

    const fieldsToUpdate = imgPath 
        ? [description, unit, price, size, type, quantity, discount_price, isOnPromotion, imgPath, id] 
        : [description, unit, price, size, type, quantity, discount_price, isOnPromotion, imgPath, id];

    connection.query(query, fieldsToUpdate, (err) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Failed to update product' });
        }
        res.json({ message: 'Product updated successfully!' });
    });
};



exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    connection.query('SELECT img FROM products WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error finding product image:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
        }

        const imgPath = results[0].img;
        if (imgPath) {
            fs.unlink(imgPath, (err) => {
                if (err) console.error('Error deleting image file:', err);
            });
        }

        connection.query('DELETE FROM products WHERE id = ?', [id], (err) => {
            if (err) {
                console.error('Error deleting product:', err);
                return res.status(500).json({ error: 'Failed to delete product' });
            }
            res.json({ message: 'Product deleted successfully!' });
        });
    });
};

exports.getProductById = (req, res) => {
    const { id } = req.params; 
    connection.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productWithImageUrl = {
            ...results[0],
            img: `http://localhost:3000/${results[0].img}` 
        };

        res.json(productWithImageUrl);
    });
};
exports.getTest = (req, res) => {
    res.status(200).send({message : 'test'});
}
exports.getOnSaleProduct = (req, res) => {
    const query = `
        SELECT id, description, price, discount_price, img 
        FROM products 
        WHERE discount_price IS NOT NULL 
        AND discount_price < price 
        AND is_on_promotion = 1
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching on-sale products:', err);
            return res.status(500).json({ error: 'Failed to fetch on-sale products' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No on-sale products found' });
        }

        const onSaleProductWithImageUrls = results.map(product => ({
            ...product,
            img: `http://localhost:3000/${product.img}` 
        }));

        res.json({
            count: onSaleProductWithImageUrls.length, 
            products: onSaleProductWithImageUrls
        });
    });
};
