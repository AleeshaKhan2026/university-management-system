const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth'); // Add this import
const router = express.Router();

// In-memory user storage
const users = [
    { 
        id: 1, 
        name: "Admin User", 
        email: "admin@university.edu", 
        password: "admin123", 
        role: "admin", 
        phone: "03001112222" 
    },
    { 
        id: 2, 
        name: "Dr. Sarah Ahmed", 
        email: "teacher@university.edu", 
        password: "teacher123", 
        role: "teacher", 
        teacherId: 1 
    },
    { 
        id: 3, 
        name: "Ali Raza", 
        email: "student@university.edu", 
        password: "student123", 
        role: "student", 
        studentId: "STU-001" 
    }
];

// Login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password' 
        });
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role, 
            name: user.name,
            studentId: user.studentId,
            teacherId: user.teacherId
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: user.studentId,
            teacherId: user.teacherId
        }
    });
});

// Verify token endpoint
router.get('/verify', verifyToken, (req, res) => {
    res.json({ 
        success: true, 
        user: req.user 
    });
});

// Get current user
router.get('/me', verifyToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: user.studentId,
            teacherId: user.teacherId
        }
    });
});

module.exports = router;