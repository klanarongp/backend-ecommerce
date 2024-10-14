const userModel = require('../models/user'); // นำเข้าโมเดลผู้ใช้
const bcrypt = require('bcrypt'); // สำหรับเข้ารหัสรหัสผ่าน
const jwt = require('jsonwebtoken'); // สำหรับสร้าง JWT

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้
exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const userId = await userModel.registerUser(email, password, role);
        res.status(201).json({ id: userId, email, role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ฟังก์ชันสำหรับการเข้าสู่ระบบ
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const results = await userModel.findUserByEmail(email);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // สร้าง JWT
        const token = jwt.sign({ email: user.email, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

        // ส่งกลับ token และ role
        res.status(200).json({ token, role: user.role }); // เพิ่มการส่ง role กลับ
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
exports.updateUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const results = await userModel.updateUser(email, password, role);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ฟังก์ชันสำหรับลบผู้ใช้
exports.deleteUser = async (req, res) => {
    const { email } = req.params;

    try {
        await userModel.deleteUser(email);
        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
