const connection = require('../db');

// GET all promotions
exports.getPromotions = (req, res) => {
    connection.query('SELECT * FROM promotion', (err, results) => {
        if (err) {
            console.error('Error fetching promotions:', err);
            return res.status(500).json({ message: 'Error fetching promotions' });
        }
        res.json(results);
    });
};

// POST a new promotion
exports.createPromotion = (req, res) => {
    const { id, description, status, discount, start_duedate, end_duedate } = req.body;
    const query = 'INSERT INTO promotion (id, description, status,discount, start_duedate, end_duedate) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [id, description, status,discount, start_duedate, end_duedate], (err, results) => {
        if (err) {
            console.error('Error creating promotion:', err);
            return res.status(500).json({ message: 'Error creating promotion' });
        }
        res.status(201).json({ message: 'Promotion created successfully!' });
    });
};

// PUT (update) a promotion
exports.updatePromotion = (req, res) => {
    const { id, description, status,discount, start_duedate, end_duedate } = req.body;

    const query = 'UPDATE promotion SET description = ?, status = ?,discount  = ?, start_duedate = ?, end_duedate = ? WHERE id = ?';
    connection.query(query, [description, status,discount, start_duedate, end_duedate, id], (err, results) => {
        if (err) {
            console.error('Error updating promotion:', err);
            return res.status(500).json({ message: 'Error updating promotion' });
        }
        res.json({ message: 'Promotion updated successfully!' });
    });
};

// DELETE a promotion
exports.deletePromotion = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM promotion WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting promotion:', err);
            return res.status(500).json({ message: 'Error deleting promotion' });
        }
        res.json({ message: 'Promotion deleted successfully!' });
    });
};

