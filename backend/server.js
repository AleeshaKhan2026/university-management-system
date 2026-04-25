// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');

// // Load environment variables
// dotenv.config();

// // Import routes
// const authRoutes = require('./routes/auth');
// const studentRoutes = require('./routes/students');
// const teacherRoutes = require('./routes/teachers');
// const courseRoutes = require('./routes/courses');
// const enrollmentRoutes = require('./routes/enrollments');
// const attendanceRoutes = require('./routes/attendance');
// const feeRoutes = require('./routes/fees');
// const departmentRoutes = require('./routes/departments');
// const timetableRoutes = require('./routes/timetable');

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // Request logging middleware
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/teachers', teacherRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/fees', feeRoutes);
// app.use('/api/departments', departmentRoutes);
// app.use('/api/timetable', timetableRoutes);

// app.use(express.static(path.join(__dirname, '../frontend')));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//     res.json({ 
//         success: true, 
//         status: 'OK', 
//         message: 'Server is running', 
//         timestamp: new Date() 
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({ 
//         success: false, 
//         message: 'Route not found' 
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ 
//         success: false, 
//         message: 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//     // console.log(`📍 API available at http://localhost:${PORT}/api`);
//     console.log(`📍 API available at /api`);
//     console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
// });



const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const attendanceRoutes = require('./routes/attendance');
const feeRoutes = require('./routes/fees');
const departmentRoutes = require('./routes/departments');
const timetableRoutes = require('./routes/timetable');

// Initialize Express app
const app = express();

// ✅ CORS Setup - FIXED
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5500',
    'https://illustrious-tarsier-d219d0.netlify.app',
    'https://*.netlify.app'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // For now, allow all during debugging
            console.log('CORS allowing origin:', origin);
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/timetable', timetableRoutes);

// Static files (for production)
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        status: 'OK', 
        message: 'Server is running', 
        timestamp: new Date() 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available on port ${PORT}`);
    console.log(`📋 Health check: /api/health`);
});