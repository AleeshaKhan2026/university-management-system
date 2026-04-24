const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// In-memory fee records
let feeRecords = [
    { 
        id: 1, 
        studentId: "STU-001", 
        semester: "Fall 2024", 
        amount: 85000, 
        dueDate: "2024-09-15", 
        status: "paid", 
        paidDate: "2024-09-10" 
    },
    { 
        id: 2, 
        studentId: "STU-001", 
        semester: "Spring 2025", 
        amount: 85000, 
        dueDate: "2025-02-15", 
        status: "pending", 
        paidDate: null 
    },
    { 
        id: 3, 
        studentId: "STU-002", 
        semester: "Spring 2025", 
        amount: 85000, 
        dueDate: "2025-02-15", 
        status: "pending", 
        paidDate: null 
    }
];

// GET all fee records
router.get('/', verifyToken, (req, res) => {
    let result = feeRecords;
    
    if (req.query.studentId) {
        result = feeRecords.filter(f => f.studentId === req.query.studentId);
    }
    
    if (req.query.status) {
        result = result.filter(f => f.status === req.query.status);
    }
    
    res.json({ success: true, data: result, count: result.length });
});

// GET single fee record
router.get('/:id', verifyToken, (req, res) => {
    const fee = feeRecords.find(f => f.id === parseInt(req.params.id));
    
    if (!fee) {
        return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    res.json({ success: true, data: fee });
});

// POST create fee record
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
    const { studentId, semester, amount, dueDate } = req.body;
    
    if (!studentId || !semester || !amount) {
        return res.status(400).json({ success: false, message: 'Student ID, semester, and amount are required' });
    }
    
    const newFee = {
        id: feeRecords.length + 1,
        studentId,
        semester,
        amount: parseFloat(amount),
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        status: 'pending',
        paidDate: null
    };
    
    feeRecords.push(newFee);
    res.status(201).json({ success: true, data: newFee, message: 'Fee record created successfully' });
});

// PUT update fee record
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const feeIndex = feeRecords.findIndex(f => f.id === parseInt(req.params.id));
    
    if (feeIndex === -1) {
        return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    feeRecords[feeIndex] = { ...feeRecords[feeIndex], ...req.body, id: parseInt(req.params.id) };
    res.json({ success: true, data: feeRecords[feeIndex], message: 'Fee record updated successfully' });
});

// PUT pay fee (mark as paid)
router.put('/:id/pay', verifyToken, (req, res) => {
    const feeIndex = feeRecords.findIndex(f => f.id === parseInt(req.params.id));
    
    if (feeIndex === -1) {
        return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    if (feeRecords[feeIndex].status === 'paid') {
        return res.status(400).json({ success: false, message: 'Fee already paid' });
    }
    
    feeRecords[feeIndex].status = 'paid';
    feeRecords[feeIndex].paidDate = new Date().toISOString().split('T')[0];
    
    res.json({ success: true, data: feeRecords[feeIndex], message: 'Fee payment recorded successfully' });
});

// DELETE fee record
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    const feeIndex = feeRecords.findIndex(f => f.id === parseInt(req.params.id));
    
    if (feeIndex === -1) {
        return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    feeRecords.splice(feeIndex, 1);
    res.json({ success: true, message: 'Fee record deleted successfully' });
});

module.exports = router;