// const express = require('express');

// const { verifyToken, checkRole } = require('../middleware/auth');
// const router = express.Router();

// // In-memory attendance database
// let attendance = [
//     { id: 1, studentId: "STU-001", courseId: "CS201", date: "2025-04-01", status: "present" },
//     { id: 2, studentId: "STU-001", courseId: "CS201", date: "2025-04-02", status: "present" },
//     { id: 3, studentId: "STU-001", courseId: "CS201", date: "2025-04-03", status: "absent" }
// ];

// // GET attendance records
// router.get('/', verifyToken, (req, res) => {
//     let result = attendance;
    
//     if (req.query.studentId) {
//         result = attendance.filter(a => a.studentId === req.query.studentId);
//     }
//     if (req.query.courseId) {
//         result = result.filter(a => a.courseId === req.query.courseId);
//     }
//     if (req.query.date) {
//         result = result.filter(a => a.date === req.query.date);
//     }
    
//     res.json({ success: true, data: result, count: result.length });
// });

// // GET attendance by ID
// router.get('/:id', verifyToken, (req, res) => {
//     const record = attendance.find(a => a.id === parseInt(req.params.id));
    
//     if (!record) {
//         return res.status(404).json({ success: false, message: 'Attendance record not found' });
//     }
    
//     res.json({ success: true, data: record });
// });

// // POST mark single attendance
// router.post('/', verifyToken, checkRole('admin', 'teacher'), (req, res) => {
//     const { studentId, courseId, date, status } = req.body;
    
//     if (!studentId || !courseId || !date || !status) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Missing required fields: studentId, courseId, date, status' 
//         });
//     }
    
//     // Check if attendance already marked for this student/course/date
//     const existing = attendance.find(a => 
//         a.studentId === studentId && 
//         a.courseId === courseId && 
//         a.date === date
//     );
    
//     if (existing) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Attendance already marked for this student on this date' 
//         });
//     }
    
//     const newAttendance = {
//         id: attendance.length + 1,
//         studentId,
//         courseId,
//         date,
//         status
//     };
    
//     attendance.push(newAttendance);
//     res.status(201).json({ success: true, data: newAttendance, message: 'Attendance marked successfully' });
// });

// // POST batch attendance marking
// router.post('/batch', verifyToken, checkRole('admin', 'teacher'), (req, res) => {
//     const { records } = req.body;
    
//     if (!records || !Array.isArray(records) || records.length === 0) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Records array is required with at least one record' 
//         });
//     }
    
//     const newRecords = [];
//     const errors = [];
    
//     for (const record of records) {
//         const { studentId, courseId, date, status } = record;
        
//         if (!studentId || !courseId || !date || !status) {
//             errors.push({ record, error: 'Missing required fields' });
//             continue;
//         }
        
//         // Check for duplicate
//         const existing = attendance.find(a => 
//             a.studentId === studentId && 
//             a.courseId === courseId && 
//             a.date === date
//         );
        
//         if (existing) {
//             errors.push({ record, error: 'Attendance already marked' });
//             continue;
//         }
        
//         const newRecord = {
//             id: attendance.length + newRecords.length + 1,
//             studentId,
//             courseId,
//             date,
//             status
//         };
        
//         newRecords.push(newRecord);
//     }
    
//     attendance.push(...newRecords);
    
//     res.status(201).json({ 
//         success: true, 
//         data: newRecords, 
//         errors: errors.length > 0 ? errors : undefined,
//         message: `${newRecords.length} attendance records marked successfully` 
//     });
// });

// // PUT update attendance
// router.put('/:id', verifyToken, checkRole('admin', 'teacher'), (req, res) => {
//     const attendanceIndex = attendance.findIndex(a => a.id === parseInt(req.params.id));
    
//     if (attendanceIndex === -1) {
//         return res.status(404).json({ success: false, message: 'Attendance record not found' });
//     }
    
//     const { status } = req.body;
//     if (status) {
//         attendance[attendanceIndex].status = status;
//     }
    
//     res.json({ success: true, data: attendance[attendanceIndex], message: 'Attendance updated successfully' });
// });

// // DELETE attendance
// router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
//     const attendanceIndex = attendance.findIndex(a => a.id === parseInt(req.params.id));
    
//     if (attendanceIndex === -1) {
//         return res.status(404).json({ success: false, message: 'Attendance record not found' });
//     }
    
//     attendance.splice(attendanceIndex, 1);
//     res.json({ success: true, message: 'Attendance record deleted successfully' });
// });

// module.exports = router;




const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory attendance database
let attendance = [
    { id: 1, studentId: "STU-001", courseId: "CS201", date: "2025-04-01", status: "present" },
    { id: 2, studentId: "STU-001", courseId: "CS201", date: "2025-04-02", status: "present" },
    { id: 3, studentId: "STU-001", courseId: "CS201", date: "2025-04-03", status: "absent" }
];

// GET attendance records
router.get('/', verifyToken, (req, res) => {
    let result = attendance;
    
    if (req.query.studentId) {
        result = attendance.filter(a => a.studentId === req.query.studentId);
    }
    if (req.query.courseId) {
        result = result.filter(a => a.courseId === req.query.courseId);
    }
    if (req.query.date) {
        result = result.filter(a => a.date === req.query.date);
    }
    
    res.json({ success: true, data: result, count: result.length });
});

// GET attendance by student
router.get('/student/:studentId', verifyToken, (req, res) => {
    const studentAttendance = attendance.filter(a => a.studentId === req.params.studentId);
    res.json({ success: true, data: studentAttendance });
});

// POST save attendance (single or batch)
router.post('/save', verifyToken, checkRole('admin', 'teacher'), (req, res) => {
    const { date, courseId, records } = req.body;
    
    if (!date || !courseId || !records || !Array.isArray(records)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Date, courseId, and records array are required' 
        });
    }
    
    const savedRecords = [];
    const errors = [];
    
    for (const record of records) {
        const { studentId, status } = record;
        
        if (!studentId || !status) {
            errors.push({ studentId, error: 'Missing studentId or status' });
            continue;
        }
        
        // Check if attendance already exists for this student, course, and date
        const existingIndex = attendance.findIndex(a => 
            a.studentId === studentId && 
            a.courseId === courseId && 
            a.date === date
        );
        
        if (existingIndex !== -1) {
            // Update existing record
            attendance[existingIndex].status = status;
            savedRecords.push(attendance[existingIndex]);
        } else {
            // Create new record
            const newRecord = {
                id: attendance.length + 1,
                studentId,
                courseId,
                date,
                status
            };
            attendance.push(newRecord);
            savedRecords.push(newRecord);
        }
    }
    
    res.json({ 
        success: true, 
        data: savedRecords, 
        errors: errors.length > 0 ? errors : undefined,
        message: `${savedRecords.length} attendance records saved successfully` 
    });
});

// POST mark single attendance
router.post('/', verifyToken, checkRole('admin', 'teacher'), (req, res) => {
    const { studentId, courseId, date, status } = req.body;
    
    if (!studentId || !courseId || !date || !status) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields: studentId, courseId, date, status' 
        });
    }
    
    // Check if attendance already marked
    const existing = attendance.find(a => 
        a.studentId === studentId && 
        a.courseId === courseId && 
        a.date === date
    );
    
    if (existing) {
        // Update existing
        existing.status = status;
        return res.json({ success: true, data: existing, message: 'Attendance updated successfully' });
    }
    
    const newAttendance = {
        id: attendance.length + 1,
        studentId,
        courseId,
        date,
        status
    };
    
    attendance.push(newAttendance);
    res.status(201).json({ success: true, data: newAttendance, message: 'Attendance marked successfully' });
});

// GET attendance summary for dashboard
router.get('/summary', verifyToken, (req, res) => {
    const students = require('./students').students; // This needs to be imported properly
    const summary = {};
    
    // Get unique student IDs
    const studentIds = [...new Set(attendance.map(a => a.studentId))];
    
    studentIds.forEach(studentId => {
        const studentAttendance = attendance.filter(a => a.studentId === studentId);
        const total = studentAttendance.length;
        const present = studentAttendance.filter(a => a.status === 'present').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        
        summary[studentId] = {
            total,
            present,
            absent: total - present,
            percentage: parseFloat(percentage)
        };
    });
    
    res.json({ success: true, data: summary });
});


// Add this to backend/routes/attendance.js for debugging
router.get('/debug/all', verifyToken, checkRole('admin'), (req, res) => {
    res.json({ success: true, data: attendance, count: attendance.length });
});

module.exports = router;