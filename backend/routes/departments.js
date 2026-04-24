const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory department database
let departments = [
    { 
        id: 1, 
        name: "Computer Science", 
        hod: "Dr. Sarah Ahmed", 
        established: 2010, 
        totalStudents: 45, 
        totalTeachers: 8 
    },
    { 
        id: 2, 
        name: "Business Administration", 
        hod: "Prof. Imran Khan", 
        established: 2008, 
        totalStudents: 32, 
        totalTeachers: 6 
    },
    { 
        id: 3, 
        name: "Software Engineering", 
        hod: "Dr. Fatima Zaidi", 
        established: 2015, 
        totalStudents: 28, 
        totalTeachers: 5 
    }
];

// GET all departments
router.get('/', verifyToken, (req, res) => {
    res.json({ success: true, data: departments, count: departments.length });
});

// GET single department
router.get('/:id', verifyToken, (req, res) => {
    const department = departments.find(d => d.id === parseInt(req.params.id));
    
    if (!department) {
        return res.status(404).json({ success: false, message: 'Department not found' });
    }
    
    res.json({ success: true, data: department });
});

// POST create department
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
    const { name, hod, established, totalStudents, totalTeachers } = req.body;
    
    if (!name || !hod) {
        return res.status(400).json({ success: false, message: 'Name and HOD are required' });
    }
    
    const newDepartment = {
        id: departments.length + 1,
        name,
        hod,
        established: established || new Date().getFullYear(),
        totalStudents: totalStudents || 0,
        totalTeachers: totalTeachers || 0
    };
    
    departments.push(newDepartment);
    res.status(201).json({ success: true, data: newDepartment, message: 'Department created successfully' });
});

// PUT update department
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const departmentIndex = departments.findIndex(d => d.id === parseInt(req.params.id));
    
    if (departmentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Department not found' });
    }
    
    departments[departmentIndex] = { ...departments[departmentIndex], ...req.body, id: parseInt(req.params.id) };
    res.json({ success: true, data: departments[departmentIndex], message: 'Department updated successfully' });
});

// DELETE department
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const departmentIndex = departments.findIndex(d => d.id === parseInt(req.params.id));
    
    if (departmentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Department not found' });
    }
    
    departments.splice(departmentIndex, 1);
    res.json({ success: true, message: 'Department deleted successfully' });
});

module.exports = router;