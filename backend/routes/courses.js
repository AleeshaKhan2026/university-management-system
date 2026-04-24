const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory course database
let courses = [
    { 
        id: "CS101", 
        name: "Programming Fundamentals", 
        code: "CS101", 
        creditHours: 3, 
        department: "Computer Science", 
        semester: 1, 
        teacher: "Dr. Sarah Ahmed", 
        prerequisites: "None" 
    },
    { 
        id: "CS201", 
        name: "Data Structures", 
        code: "CS201", 
        creditHours: 3, 
        department: "Computer Science", 
        semester: 2, 
        teacher: "Dr. Sarah Ahmed", 
        prerequisites: "CS101" 
    },
    { 
        id: "CS301", 
        name: "Database Systems", 
        code: "CS301", 
        creditHours: 3, 
        department: "Computer Science", 
        semester: 3, 
        teacher: "Dr. Fatima Zaidi", 
        prerequisites: "CS201" 
    },
    { 
        id: "BA101", 
        name: "Principles of Management", 
        code: "BA101", 
        creditHours: 3, 
        department: "Business Administration", 
        semester: 1, 
        teacher: "Prof. Imran Khan", 
        prerequisites: "None" 
    }
];

// GET all courses
router.get('/', verifyToken, (req, res) => {
    res.json({ success: true, data: courses, count: courses.length });
});

// GET single course
router.get('/:id', verifyToken, (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    
    if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.json({ success: true, data: course });
});

// POST create course
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
    const { name, code, creditHours, department, semester, teacher, prerequisites } = req.body;
    
    if (!name || !code) {
        return res.status(400).json({ success: false, message: 'Name and code are required' });
    }
    
    const newCourse = {
        id: code,
        name,
        code,
        creditHours: creditHours || 3,
        department: department || 'General',
        semester: semester || 1,
        teacher: teacher || 'TBD',
        prerequisites: prerequisites || 'None'
    };
    
    courses.push(newCourse);
    res.status(201).json({ success: true, data: newCourse, message: 'Course created successfully' });
});

// PUT update course
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const courseIndex = courses.findIndex(c => c.id === req.params.id);
    
    if (courseIndex === -1) {
        return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const updatedCourse = { ...courses[courseIndex], ...req.body, id: req.params.id };
    courses[courseIndex] = updatedCourse;
    
    res.json({ success: true, data: updatedCourse, message: 'Course updated successfully' });
});

// DELETE course
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const courseIndex = courses.findIndex(c => c.id === req.params.id);
    
    if (courseIndex === -1) {
        return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    courses.splice(courseIndex, 1);
    res.json({ success: true, message: 'Course deleted successfully' });
});

module.exports = router;