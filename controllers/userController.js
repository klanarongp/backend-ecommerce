const userModel = require('../models/user'); // นำเข้าโมเดลผู้ใช้
const bcrypt = require('bcrypt'); // สำหรับเข้ารหัสรหัสผ่าน
const jwt = require('jsonwebtoken'); // สำหรับสร้าง JWT

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้
exports.register = async (req, res) => {
    const { email, password } = req.body; // เอา role ออก
    const role = 'user'; // ตั้งค่า role เป็น 'user'
    console.log(req.body); // แสดงค่าที่รับมาใน console

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
        // เปลี่ยนไปใช้ getAllUsersWithAddress
        const users = await userModel.getAllUsersWithAddress(); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
exports.updateUser = async (req, res) => {
    console.log('test')
    const { email, street_address, city, state, postal_code, country, phone } = req.body;

    // log ข้อมูลที่ได้รับจาก request
    console.log('Received request with body:', req.body);

    try {
        const results = await userModel.updateUser(email, street_address, city, state, postal_code, country, phone);
        console.log("Update Results:", results); // log ผลลัพธ์การอัปเดต
        console.log("Received data:", req.body);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
        console.error("Update Error:", error); // log error
        res.status(500).json({ error: error.message });
    }
};

// ฟังก์ชันสำหรับลบผู้ใช้
exports.deleteUser = async (req, res) => {
    const { email } = req.params;

    try {
        await userModel.deleteUserWithAddress(email);
        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    try {
        // ตรวจสอบว่าผู้ใช้งานมีอยู่จริงก่อน
        const user = await userModel.findUserByEmail(email);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.updateUserPassword(email, hashedPassword);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};
