// middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // แยก token จาก header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // ควรเป็น Bearer <token>

    if (!token) {
        return res.status(403).json({ message: 'ไม่พบ token' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'token ไม่ถูกต้อง' });
        }
        req.user = user; // คุณสามารถเข้าถึงข้อมูลผู้ใช้ที่ decode ได้จาก req.user
        next();
    });
};

module.exports = authenticate;
