const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory teacher database
let teachers = [
    { 
        id: 1, 
        name: "Dr. Sarah Ahmed", 
        email: "sarah@university.edu", 
        department: "Computer Science", 
        qualification: "PhD CS", 
        phone: "03001112233", 
        joiningDate: "2020-08-15" 
    },
    { 
        id: 2, 
        name: "Prof. Imran Khan", 
        email: "imran@university.edu", 
        department: "Business Administration", 
        qualification: "PhD Management", 
        phone: "03001112234", 
        joiningDate: "2019-01-10" 
    },
    { 
        id: 3, 
        name: "Dr. Fatima Zaidi", 
        email: "fatima@university.edu", 
        department: "Computer Science", 
        qualification: "PhD AI", 
        phone: "03001112235", 
        joiningDate: "2021-03-20" 
    }
];

// GET all teachers
router.get('/', verifyToken, (req, res) => {
    res.json({ success: true, data: teachers, count: teachers.length });
});

// GET single teacher
router.get('/:id', verifyToken, (req, res) => {
    const teacher = teachers.find(t => t.id === parseInt(req.params.id));
    
    if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    
    res.json({ success: true, data: teacher });
});

// POST create teacher
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
    const { name, email, department, qualification, phone, joiningDate } = req.body;
    
    if (!name || !email || !department) {
        return res.status(400).json({ success: false, message: 'Name, email, and department are required' });
    }
    
    const newTeacher = {
        id: teachers.length + 1,
        name,
        email,
        department,
        qualification: qualification || '',
        phone: phone || '',
        joiningDate: joiningDate || new Date().toISOString().split('T')[0]
    };
    
    teachers.push(newTeacher);
    res.status(201).json({ success: true, data: newTeacher });
});

// PUT update teacher
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const teacherIndex = teachers.findIndex(t => t.id === parseInt(req.params.id));
    
    if (teacherIndex === -1) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    
    teachers[teacherIndex] = { ...teachers[teacherIndex], ...req.body, id: parseInt(req.params.id) };
    res.json({ success: true, data: teachers[teacherIndex] });
});

// DELETE teacher
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const teacherIndex = teachers.findIndex(t => t.id === parseInt(req.params.id));
    
    if (teacherIndex === -1) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    
    teachers.splice(teacherIndex, 1);
    res.json({ success: true, message: 'Teacher deleted successfully' });
});

module.exports = router;