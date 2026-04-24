const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory student database
let students = [
    { 
        id: "STU-001", 
        name: "Ali Raza", 
        email: "ali@student.edu", 
        phone: "03001234567", 
        address: "Hostel A, Room 12", 
        program: "BS Computer Science", 
        semester: 3, 
        enrollmentYear: 2023, 
        status: "active", 
        cgpa: 3.75, 
        totalCredits: 72 
    },
    { 
        id: "STU-002", 
        name: "Sara Khan", 
        email: "sara@student.edu", 
        phone: "03001234568", 
        address: "Street 5, Gulberg", 
        program: "BS Computer Science", 
        semester: 2, 
        enrollmentYear: 2024, 
        status: "active", 
        cgpa: 3.92, 
        totalCredits: 48 
    },
    { 
        id: "STU-003", 
        name: "Bilal Ahmed", 
        email: "bilal@student.edu", 
        phone: "03001234569", 
        address: "Model Town", 
        program: "BBA", 
        semester: 4, 
        enrollmentYear: 2022, 
        status: "active", 
        cgpa: 3.45, 
        totalCredits: 96 
    }
];

// GET all students
router.get('/', verifyToken, (req, res) => {
    res.json({ success: true, data: students, count: students.length });
});

// GET single student by ID
router.get('/:id', verifyToken, (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ success: true, data: student });
});

// POST create new student
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
    const { name, email, phone, address, program, semester, enrollmentYear } = req.body;
    
    if (!name || !email || !program) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name, email, and program are required' 
        });
    }
    
    const newId = `STU-${String(students.length + 100).slice(1)}`;
    const newStudent = {
        id: newId,
        name,
        email,
        phone: phone || '',
        address: address || '',
        program,
        semester: semester || 1,
        enrollmentYear: enrollmentYear || new Date().getFullYear(),
        status: 'active',
        cgpa: 0,
        totalCredits: 0
    };
    
    students.push(newStudent);
    res.status(201).json({ success: true, data: newStudent, message: 'Student created successfully' });
});

// PUT update student
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const studentIndex = students.findIndex(s => s.id === req.params.id);
    
    if (studentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    const updatedStudent = { ...students[studentIndex], ...req.body, id: req.params.id };
    students[studentIndex] = updatedStudent;
    
    res.json({ success: true, data: updatedStudent, message: 'Student updated successfully' });
});

// DELETE student
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const studentIndex = students.findIndex(s => s.id === req.params.id);
    
    if (studentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    students.splice(studentIndex, 1);
    res.json({ success: true, message: 'Student deleted successfully' });
});

module.exports = router;