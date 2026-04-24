const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory enrollment database
let enrollments = [
    { 
        id: 1, 
        studentId: "STU-001", 
        courseId: "CS101", 
        semester: "Fall 2024", 
        status: "completed", 
        marks: 85, 
        grade: "A", 
        gpa: 4.0 
    },
    { 
        id: 2, 
        studentId: "STU-001", 
        courseId: "CS201", 
        semester: "Spring 2025", 
        status: "ongoing", 
        marks: 78, 
        grade: "B+", 
        gpa: 3.3 
    },
    { 
        id: 3, 
        studentId: "STU-002", 
        courseId: "CS101", 
        semester: "Spring 2025", 
        status: "ongoing", 
        marks: 88, 
        grade: "A-", 
        gpa: 3.7 
    }
];

// GET all enrollments
router.get('/', verifyToken, (req, res) => {
    let result = enrollments;
    
    // Filter by studentId if provided
    if (req.query.studentId) {
        result = enrollments.filter(e => e.studentId === req.query.studentId);
    }
    
    // Filter by courseId if provided
    if (req.query.courseId) {
        result = result.filter(e => e.courseId === req.query.courseId);
    }
    
    res.json({ success: true, data: result, count: result.length });
});

// GET single enrollment
router.get('/:id', verifyToken, (req, res) => {
    const enrollment = enrollments.find(e => e.id === parseInt(req.params.id));
    
    if (!enrollment) {
        return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    res.json({ success: true, data: enrollment });
});

// POST create enrollment
router.post('/', verifyToken, (req, res) => {
    const { studentId, courseId, semester } = req.body;
    
    if (!studentId || !courseId) {
        return res.status(400).json({ success: false, message: 'Student ID and Course ID are required' });
    }
    
    // Check if already enrolled
    const existing = enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
    if (existing) {
        return res.status(400).json({ success: false, message: 'Student already enrolled in this course' });
    }
    
    const newEnrollment = {
        id: enrollments.length + 1,
        studentId,
        courseId,
        semester: semester || 'Current',
        status: 'ongoing',
        marks: 0,
        grade: 'P',
        gpa: 0
    };
    
    enrollments.push(newEnrollment);
    res.status(201).json({ success: true, data: newEnrollment, message: 'Enrollment created successfully' });
});

// PUT update enrollment marks
router.put('/:id', verifyToken, checkRole('admin', 'teacher'), (req, res) => {
    const enrollmentIndex = enrollments.findIndex(e => e.id === parseInt(req.params.id));
    
    if (enrollmentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    const { marks } = req.body;
    
    if (marks !== undefined) {
        let grade = '';
        let gpa = 0;
        
        if (marks >= 85) { grade = "A"; gpa = 4.0; }
        else if (marks >= 80) { grade = "A-"; gpa = 3.7; }
        else if (marks >= 75) { grade = "B+"; gpa = 3.3; }
        else if (marks >= 70) { grade = "B"; gpa = 3.0; }
        else if (marks >= 60) { grade = "C"; gpa = 2.0; }
        else { grade = "F"; gpa = 0.0; }
        
        enrollments[enrollmentIndex].marks = marks;
        enrollments[enrollmentIndex].grade = grade;
        enrollments[enrollmentIndex].gpa = gpa;
        enrollments[enrollmentIndex].status = "completed";
    }
    
    // Update other fields if provided
    if (req.body.status) enrollments[enrollmentIndex].status = req.body.status;
    
    res.json({ success: true, data: enrollments[enrollmentIndex], message: 'Enrollment updated successfully' });
});

// DELETE enrollment
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const enrollmentIndex = enrollments.findIndex(e => e.id === parseInt(req.params.id));
    
    if (enrollmentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    enrollments.splice(enrollmentIndex, 1);
    res.json({ success: true, message: 'Enrollment deleted successfully' });
});

module.exports = router;