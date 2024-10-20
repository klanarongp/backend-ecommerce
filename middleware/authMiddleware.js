const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        
        req.user = user;
        next();
    });
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};
