const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory timetable database
let timetable = [
    { 
        id: 1,
        day: "Monday", 
        time: "09:00-10:30", 
        course: "CS201 - Data Structures", 
        courseCode: "CS201",
        room: "Room 101", 
        teacher: "Dr. Sarah Ahmed",
        section: "A",
        semester: 3
    },
    { 
        id: 2,
        day: "Monday", 
        time: "11:00-12:30", 
        course: "CS301 - Database Systems", 
        courseCode: "CS301",
        room: "Room 102", 
        teacher: "Dr. Fatima Zaidi",
        section: "A",
        semester: 3
    },
    { 
        id: 3,
        day: "Tuesday", 
        time: "09:00-10:30", 
        course: "BA101 - Management", 
        courseCode: "BA101",
        room: "Room 201", 
        teacher: "Prof. Imran Khan",
        section: "B",
        semester: 2
    },
    { 
        id: 4,
        day: "Tuesday", 
        time: "11:00-12:30", 
        course: "CS101 - Programming", 
        courseCode: "CS101",
        room: "Room 101", 
        teacher: "Dr. Sarah Ahmed",
        section: "A",
        semester: 1
    }
];

// GET all timetable entries
router.get('/', verifyToken, (req, res) => {
    let result = timetable;
    
    // Apply filters
    if (req.query.day) {
        result = result.filter(t => t.day === req.query.day);
    }
    if (req.query.section) {
        result = result.filter(t => t.section === req.query.section);
    }
    if (req.query.semester) {
        result = result.filter(t => t.semester == req.query.semester);
    }
    
    res.json({ success: true, data: result, count: result.length });
});

// GET single timetable entry
router.get('/:id', verifyToken, (req, res) => {
    const entry = timetable.find(t => t.id === parseInt(req.params.id));
    
    if (!entry) {
        return res.status(404).json({ success: false, message: 'Schedule entry not found' });
    }
    
    res.json({ success: true, data: entry });
});

// POST create new timetable entry
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
    const { day, time, course, courseCode, room, teacher, section, semester } = req.body;
    
    if (!day || !time || !course || !room) {
        return res.status(400).json({ 
            success: false, 
            message: 'Day, time, course, and room are required' 
        });
    }
    
    const newEntry = {
        id: timetable.length + 1,
        day,
        time,
        course,
        courseCode: courseCode || '',
        room,
        teacher: teacher || 'TBD',
        section: section || 'A',
        semester: semester || 1
    };
    
    timetable.push(newEntry);
    res.status(201).json({ success: true, data: newEntry, message: 'Schedule entry added successfully' });
});

// PUT update timetable entry
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const index = timetable.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Schedule entry not found' });
    }
    
    timetable[index] = { ...timetable[index], ...req.body, id: parseInt(req.params.id) };
    res.json({ success: true, data: timetable[index], message: 'Schedule entry updated successfully' });
});

// DELETE timetable entry
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const index = timetable.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Schedule entry not found' });
    }
    
    timetable.splice(index, 1);
    res.json({ success: true, message: 'Schedule entry deleted successfully' });
});

// GET days for dropdown
router.get('/days/list', verifyToken, (req, res) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    res.json({ success: true, data: days });
});

module.exports = router;