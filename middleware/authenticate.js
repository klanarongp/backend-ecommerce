// middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: 'ไม่พบ token' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'token ไม่ถูกต้อง' });
        }
        req.user = user; 
        next();
    });
};

module.exports = authenticate;
