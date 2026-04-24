// Main Application Controller
class UniversityApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        // Check authentication
        const isAuthenticated = await auth.verifySession();

        if (!isAuthenticated) {
            this.renderLogin();
        } else {
            this.renderApp();
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'darkModeToggle') {
                document.body.classList.toggle('dark-mode');
            }
            if (e.target.id === 'logoutBtn') {
                auth.logout();
            }
            if (e.target.id === 'mobileMenuBtn') {
                document.getElementById('sidebar')?.classList.toggle('show');
            }
        });
    }

    renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div class="card login-card p-5 shadow-lg" style="width: 450px; border-radius: 28px; background: white;">
                    <div class="text-center mb-4">
                        <i class="bi bi-mortarboard-fill fs-1" style="color: #4f46e5;"></i>
                        <h2 class="mt-2 fw-bold">UniManager Pro</h2>
                        <p class="text-muted">Complete University Management System</p>
                    </div>
                    <form id="loginForm">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Email Address</label>
                            <input type="email" class="form-control" id="loginEmail" required placeholder="admin@university.edu">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Password</label>
                            <input type="password" class="form-control" id="loginPassword" required placeholder="••••••">
                        </div>
                        <button type="submit" class="btn btn-primary w-100 py-2">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Login to Dashboard
                        </button>
                    </form>
                    <div class="mt-4 pt-3 border-top">
                        <div class="row text-center small text-muted g-2">
                            <div class="col-4">
                                <strong>Admin:</strong><br>admin@university.edu<br>admin123
                            </div>
                            <div class="col-4">
                                <strong>Teacher:</strong><br>teacher@university.edu<br>teacher123
                            </div>
                            <div class="col-4">
                                <strong>Student:</strong><br>student@university.edu<br>student123
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const success = await auth.login(email, password);
            if (success) {
                this.renderApp();
            } else {
                alert('Invalid credentials');
            }
        });
    }

    renderApp() {
        const user = auth.getUser();
        const role = auth.getRole();

        let sidebarHtml = this.getSidebarHtml(role);

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="d-flex">
                <div class="sidebar" id="sidebar">
                    <div class="brand"><i class="bi bi-mortarboard-fill me-2"></i>UniManager Pro</div>
                    <nav class="nav flex-column mt-3" id="sidebarNav">${sidebarHtml}</nav>
                    <div class="mt-auto p-3 border-top border-secondary">
                        <button class="btn btn-outline-light w-100 mb-2" id="darkModeToggle">
                            <i class="bi bi-moon-stars"></i> Dark Mode
                        </button>
                        <button class="btn btn-outline-danger w-100" id="logoutBtn">
                            <i class="bi bi-box-arrow-right"></i> Logout
                        </button>
                    </div>
                </div>
                
                <div class="main-content" id="mainContent">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <button class="btn btn-light d-lg-none" id="mobileMenuBtn">
                            <i class="bi bi-list"></i> Menu
                        </button>
                        <div class="d-flex gap-3 align-items-center ms-auto">
                            <span class="badge bg-primary p-2 px-3 rounded-pill">${role?.toUpperCase() || 'USER'}</span>
                            <i class="bi bi-bell fs-5" role="button" data-bs-toggle="dropdown"></i>
                            <span><i class="bi bi-person-circle fs-4"></i> ${user?.name || 'User'}</span>
                        </div>
                    </div>
                    <div id="pageContent" class="fade-in">
                        <div class="loading"><div class="loading-spinner"></div><p class="mt-3">Loading...</p></div>
                    </div>
                </div>
            </div>
            <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>
        `;

        this.setupNavigation();
        this.loadPageData(this.currentPage, role);
    }

    getSidebarHtml(role) {
        if (role === 'admin') {
            return `
                <a class="nav-link active" data-page="dashboard"><i class="bi bi-speedometer2"></i> Dashboard</a>
                <a class="nav-link" data-page="students"><i class="bi bi-people"></i> Student Management</a>
                <a class="nav-link" data-page="courses"><i class="bi bi-book"></i> Course Management</a>
                <a class="nav-link" data-page="attendance"><i class="bi bi-calendar-check"></i> Attendance System</a>
                <a class="nav-link" data-page="results"><i class="bi bi-trophy"></i> Result System</a>
                <a class="nav-link" data-page="fees"><i class="bi bi-wallet2"></i> Fee Management</a>
                <a class="nav-link" data-page="timetable"><i class="bi bi-calendar-week"></i> Timetable</a>
            `;
        } else if (role === 'teacher') {
            return `
                <a class="nav-link active" data-page="dashboard"><i class="bi bi-speedometer2"></i> Teacher Dashboard</a>
                <a class="nav-link" data-page="attendance"><i class="bi bi-calendar-check"></i> Mark Attendance</a>
                <a class="nav-link" data-page="results"><i class="bi bi-trophy"></i> Enter Results</a>
                <a class="nav-link" data-page="timetable"><i class="bi bi-calendar-week"></i> My Schedule</a>
            `;
        } else {
            return `
                <a class="nav-link active" data-page="dashboard"><i class="bi bi-speedometer2"></i> Student Dashboard</a>
                <a class="nav-link" data-page="courses"><i class="bi bi-book"></i> My Courses</a>
                <a class="nav-link" data-page="attendance"><i class="bi bi-calendar-check"></i> My Attendance</a>
                <a class="nav-link" data-page="fees"><i class="bi bi-wallet2"></i> Fee Status</a>
                <a class="nav-link" data-page="timetable"><i class="bi bi-calendar-week"></i> Class Schedule</a>
            `;
        }
    }

    setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.currentPage = link.getAttribute('data-page');
                this.loadPageData(this.currentPage, auth.getRole());
            });
        });
    }

    async loadPageData(page, role) {
        const content = document.getElementById('pageContent');
        content.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p class="mt-3">Loading...</p></div>';

        try {
            let html = '';

            switch (page) {
                case 'dashboard':
                    html = await this.renderDashboard(role);
                    break;
                case 'students':
                    html = await this.renderStudents();
                    break;
                case 'courses':
                    html = await this.renderCourses(role);
                    break;
                case 'attendance':
                    html = await this.renderAttendance(role);
                    break;
                case 'results':
                    html = await this.renderResults(role);
                    break;
                case 'fees':
                    html = await this.renderFees(role);
                    break;
                case 'timetable':
                    html = this.renderTimetable();
                    break;
                default:
                    html = '<div class="card p-4">Page not found</div>';
            }

            content.innerHTML = html;
            this.attachPageHandlers(page, role);
        } catch (error) {
            content.innerHTML = `<div class="alert alert-danger">Error loading page: ${error.message}</div>`;
        }
    }


    async renderDashboard(role) {
        // if (role === 'admin') {
        //     // Admin dashboard code (keep your existing admin dashboard)
        //     const students = (await api.getStudents()).data;
        //     const courses = (await api.getCourses()).data;
        //     const teachers = (await api.getTeachers()).data;
        //     const fees = (await api.getFees()).data;

        //     const totalStudents = students.length;
        //     const totalCourses = courses.length;
        //     const totalTeachers = teachers.length;
        //     const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
        //     const pendingFees = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

        //     return `
        //         <div class="row g-4 mb-4">
        //             <div class="col-md-3"><div class="stat-card"><div class="stat-value">${totalStudents}</div><div>Total Students</div></div></div>
        //             <div class="col-md-3"><div class="stat-card"><div class="stat-value">${totalCourses}</div><div>Active Courses</div></div></div>
        //             <div class="col-md-3"><div class="stat-card"><div class="stat-value">₨ ${(totalRevenue/1000).toFixed(0)}K</div><div>Revenue Collected</div></div></div>
        //             <div class="col-md-3"><div class="stat-card"><div class="stat-value">${totalTeachers}</div><div>Faculty Members</div></div></div>
        //         </div>
        //         <div class="card-premium"><h5>Welcome to Admin Dashboard</h5><p>Manage students, courses, attendance, and more from the sidebar menu.</p></div>
        //     `;
        // } 
        // else if (role === 'teacher') {
        //     // TEACHER DASHBOARD - Fixed Version
        //     const user = auth.getUser();
        //     const courses = (await api.getCourses()).data;
        //     const students = (await api.getStudents()).data;

        //     // Get teacher's courses (assuming teacher name matches)
        //     const teacherName = user.name;
        //     const myCourses = courses.filter(c => c.teacher === teacherName);

        //     // Get today's schedule
        //     const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        //     const timetable = [
        //         { day: "Monday", time: "09:00-10:30", course: "CS201 - Data Structures", room: "Room 101" },
        //         { day: "Tuesday", time: "11:00-12:30", course: "CS301 - Database Systems", room: "Room 102" },
        //         { day: "Wednesday", time: "09:00-10:30", course: "CS101 - Programming", room: "Room 101" }
        //     ];
        //     const todaySchedule = timetable.filter(t => t.day === today);

        //     // Calculate statistics
        //     const totalStudents = students.length;
        //     const totalCourses = myCourses.length;

        //     return `
        //         <!-- Welcome Section -->
        //         <div class="alert alert-info alert-dismissible fade show mb-4" role="alert">
        //             <i class="bi bi-mortarboard-fill me-2"></i>
        //             <strong>Welcome back, ${teacherName}!</strong> You have ${totalCourses} courses to manage today.
        //             <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        //         </div>

        //         <!-- Statistics Cards -->
        //         <div class="row g-4 mb-4">
        //             <div class="col-md-4">
        //                 <div class="stat-card">
        //                     <div class="d-flex justify-content-between align-items-start">
        //                         <div>
        //                             <i class="bi bi-book fs-1 text-primary"></i>
        //                             <div class="stat-value mt-2">${totalCourses}</div>
        //                             <div class="text-muted">My Courses</div>
        //                             <small>This semester</small>
        //                         </div>
        //                         <div class="bg-primary bg-opacity-10 p-2 rounded">
        //                             <i class="bi bi-journal-bookmark-fill text-primary"></i>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="col-md-4">
        //                 <div class="stat-card">
        //                     <div class="d-flex justify-content-between align-items-start">
        //                         <div>
        //                             <i class="bi bi-people fs-1 text-success"></i>
        //                             <div class="stat-value mt-2">${totalStudents}</div>
        //                             <div class="text-muted">Total Students</div>
        //                             <small>Across all courses</small>
        //                         </div>
        //                         <div class="bg-success bg-opacity-10 p-2 rounded">
        //                             <i class="bi bi-people-fill text-success"></i>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="col-md-4">
        //                 <div class="stat-card">
        //                     <div class="d-flex justify-content-between align-items-start">
        //                         <div>
        //                             <i class="bi bi-calendar-check fs-1 text-warning"></i>
        //                             <div class="stat-value mt-2">${todaySchedule.length}</div>
        //                             <div class="text-muted">Today's Classes</div>
        //                             <small>${today}</small>
        //                         </div>
        //                         <div class="bg-warning bg-opacity-10 p-2 rounded">
        //                             <i class="bi bi-calendar-week-fill text-warning"></i>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         <!-- My Courses Section -->
        //         <div class="row g-4 mb-4">
        //             <div class="col-md-6">
        //                 <div class="card-premium">
        //                     <div class="d-flex justify-content-between align-items-center mb-3">
        //                         <h5 class="fw-semibold mb-0">
        //                             <i class="bi bi-book me-2 text-primary"></i>
        //                             My Assigned Courses
        //                         </h5>
        //                         <span class="badge bg-primary">${totalCourses} Courses</span>
        //                     </div>
        //                     ${myCourses.length > 0 ? `
        //                         <div class="list-group">
        //                             ${myCourses.map(course => `
        //                                 <div class="list-group-item border-0 mb-2 rounded-3 shadow-sm">
        //                                     <div class="d-flex justify-content-between align-items-center">
        //                                         <div>
        //                                             <h6 class="mb-1 fw-semibold">${course.name}</h6>
        //                                             <small class="text-muted">Code: ${course.code} | Credits: ${course.creditHours}</small>
        //                                             <br><small class="text-muted">Department: ${course.department}</small>
        //                                         </div>
        //                                         <div class="btn-group">
        //                                             <button class="btn btn-sm btn-outline-primary" onclick="document.querySelector('[data-page=\"attendance\"]').click()">
        //                                                 <i class="bi bi-calendar-check"></i> Mark Attendance
        //                                             </button>
        //                                             <button class="btn btn-sm btn-outline-success" onclick="document.querySelector('[data-page=\"results\"]').click()">
        //                                                 <i class="bi bi-trophy"></i> Enter Results
        //                                             </button>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             `).join('')}
        //                         </div>
        //                     ` : `
        //                         <div class="text-center py-4">
        //                             <i class="bi bi-inbox fs-1 text-muted"></i>
        //                             <p class="mt-2">No courses assigned yet.</p>
        //                         </div>
        //                     `}
        //                 </div>
        //             </div>

        //             <!-- Today's Schedule -->
        //             <div class="col-md-6">
        //                 <div class="card-premium">
        //                     <div class="d-flex justify-content-between align-items-center mb-3">
        //                         <h5 class="fw-semibold mb-0">
        //                             <i class="bi bi-calendar-week me-2 text-info"></i>
        //                             Today's Schedule - ${today}
        //                         </h5>
        //                         <i class="bi bi-clock-history text-info"></i>
        //                     </div>
        //                     ${todaySchedule.length > 0 ? `
        //                         <div class="timeline">
        //                             ${todaySchedule.map(schedule => `
        //                                 <div class="d-flex mb-3 p-3 border rounded-3">
        //                                     <div class="me-3">
        //                                         <div class="bg-info bg-opacity-10 rounded-circle p-2">
        //                                             <i class="bi bi-clock text-info"></i>
        //                                         </div>
        //                                     </div>
        //                                     <div class="flex-grow-1">
        //                                         <h6 class="mb-1 fw-semibold">${schedule.course}</h6>
        //                                         <small class="text-muted">Time: ${schedule.time}</small>
        //                                         <br><small class="text-muted">Room: ${schedule.room}</small>
        //                                     </div>
        //                                     <button class="btn btn-sm btn-primary" onclick="document.querySelector('[data-page=\"attendance\"]').click()">
        //                                         Take Attendance
        //                                     </button>
        //                                 </div>
        //                             `).join('')}
        //                         </div>
        //                     ` : `
        //                         <div class="text-center py-4">
        //                             <i class="bi bi-calendar-x fs-1 text-muted"></i>
        //                             <p class="mt-2">No classes scheduled for today.</p>
        //                             <small class="text-muted">Enjoy your free time!</small>
        //                         </div>
        //                     `}
        //                 </div>
        //             </div>
        //         </div>

        //         <!-- Quick Actions -->
        //         <div class="row g-4">
        //             <div class="col-md-4">
        //                 <div class="card text-center border-0 shadow-sm">
        //                     <div class="card-body">
        //                         <i class="bi bi-person-plus fs-1 text-primary"></i>
        //                         <h6 class="mt-2">Mark Attendance</h6>
        //                         <p class="small text-muted">Record student attendance for your classes</p>
        //                         <button class="btn btn-primary btn-sm" onclick="document.querySelector('[data-page=\"attendance\"]').click()">
        //                             Go to Attendance
        //                         </button>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="col-md-4">
        //                 <div class="card text-center border-0 shadow-sm">
        //                     <div class="card-body">
        //                         <i class="bi bi-trophy fs-1 text-success"></i>
        //                         <h6 class="mt-2">Enter Results</h6>
        //                         <p class="small text-muted">Update student grades and performance</p>
        //                         <button class="btn btn-success btn-sm" onclick="document.querySelector('[data-page=\"results\"]').click()">
        //                             Go to Results
        //                         </button>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="col-md-4">
        //                 <div class="card text-center border-0 shadow-sm">
        //                     <div class="card-body">
        //                         <i class="bi bi-person-badge fs-1 text-info"></i>
        //                         <h6 class="mt-2">View Schedule</h6>
        //                         <p class="small text-muted">Check your complete weekly timetable</p>
        //                         <button class="btn btn-info btn-sm text-white" onclick="document.querySelector('[data-page=\"timetable\"]').click()">
        //                             View Timetable
        //                         </button>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         <!-- Recent Activity / Notifications -->
        //         <div class="row g-4 mt-2">
        //             <div class="col-12">
        //                 <div class="card-premium">
        //                     <h5 class="fw-semibold mb-3">
        //                         <i class="bi bi-bell me-2 text-warning"></i>
        //                         Recent Activities
        //                     </h5>
        //                     <div class="list-group">
        //                         <div class="list-group-item border-0 bg-light rounded-3 mb-2">
        //                             <div class="d-flex align-items-center">
        //                                 <div class="me-3">
        //                                     <i class="bi bi-check-circle-fill text-success"></i>
        //                                 </div>
        //                                 <div>
        //                                     <strong>Attendance marked</strong><br>
        //                                     <small class="text-muted">Today at 09:00 AM - CS201 class</small>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div class="list-group-item border-0 bg-light rounded-3">
        //                             <div class="d-flex align-items-center">
        //                                 <div class="me-3">
        //                                     <i class="bi bi-pencil-square text-primary"></i>
        //                                 </div>
        //                                 <div>
        //                                     <strong>Results updated</strong><br>
        //                                     <small class="text-muted">Yesterday - Mid-term exam results</small>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     `;
        // }


        if (role === 'admin') {
            // Fetch all data
            const students = (await api.getStudents()).data;
            const courses = (await api.getCourses()).data;
            const teachers = (await api.getTeachers()).data;
            const fees = (await api.getFees()).data;
            const enrollments = (await api.getEnrollments()).data;

            // Calculate statistics
            const totalStudents = students.length;
            const totalCourses = courses.length;
            const totalTeachers = teachers.length;
            const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
            const pendingFees = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

            // Calculate department wise enrollment
            const deptStats = {
                "Computer Science": students.filter(s => s.program === "BS Computer Science").length,
                "Business Administration": students.filter(s => s.program === "BBA").length,
                "Software Engineering": students.filter(s => s.program === "Software Engineering").length
            };

            // Calculate GPA distribution
            const gpaStats = {
                "3.5+ GPA": students.filter(s => s.cgpa >= 3.5).length,
                "3.0-3.5": students.filter(s => s.cgpa >= 3.0 && s.cgpa < 3.5).length,
                "<3.0 GPA": students.filter(s => s.cgpa < 3.0 && s.cgpa > 0).length,
                "N/A": students.filter(s => s.cgpa === 0 || !s.cgpa).length
            };

            // Calculate attendance percentage (mock data for demo)
            const attendanceStats = students.map(s => ({
                ...s,
                attendance: Math.floor(Math.random() * 30) + 65 // Random 65-95%
            }));

            // Top performing students (by CGPA)
            const topStudents = [...students].sort((a, b) => b.cgpa - a.cgpa).slice(0, 5);

            // Recent notifications
            const notifications = [
                { title: "Welcome to UniManager Pro", message: "System ready for use", type: "success", date: new Date() },
                { title: "Fee Deadline", message: "Spring 2025 fee deadline is approaching", type: "warning", date: new Date() },
                { title: "Exam Schedule", message: "Mid-term exams starting from next week", type: "info", date: new Date() }
            ];

            // Create charts after render
            setTimeout(() => {
                // Enrollment Chart
                const enrollmentCtx = document.getElementById('enrollmentChart')?.getContext('2d');
                if (enrollmentCtx) {
                    new Chart(enrollmentCtx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(deptStats),
                            datasets: [{
                                label: 'Enrolled Students',
                                data: Object.values(deptStats),
                                backgroundColor: '#4f46e5',
                                borderRadius: 8,
                                barPercentage: 0.7
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: false }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { display: true, text: 'Number of Students' }
                                }
                            }
                        }
                    });
                }

                // GPA Distribution Chart
                const gpaCtx = document.getElementById('gpaChart')?.getContext('2d');
                if (gpaCtx) {
                    new Chart(gpaCtx, {
                        type: 'doughnut',
                        data: {
                            labels: Object.keys(gpaStats),
                            datasets: [{
                                data: Object.values(gpaStats),
                                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: { position: 'bottom' },
                                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} students` } }
                            }
                        }
                    });
                }
            }, 100);

            return `
            <!-- Statistics Cards -->
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <i class="bi bi-people fs-1 text-primary"></i>
                                <div class="stat-value mt-2">${totalStudents}</div>
                                <div class="text-muted">Total Students</div>
                                <small class="text-success"><i class="bi bi-arrow-up"></i> +12% vs last year</small>
                            </div>
                            <div class="bg-primary bg-opacity-10 p-2 rounded">
                                <i class="bi bi-graph-up text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <i class="bi bi-book fs-1 text-success"></i>
                                <div class="stat-value mt-2">${totalCourses}</div>
                                <div class="text-muted">Active Courses</div>
                                <small><i class="bi bi-building"></i> ${Object.keys(deptStats).length} Departments</small>
                            </div>
                            <div class="bg-success bg-opacity-10 p-2 rounded">
                                <i class="bi bi-journal-bookmark-fill text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <i class="bi bi-cash-stack fs-1 text-warning"></i>
                                <div class="stat-value mt-2">₨ ${(totalRevenue / 1000).toFixed(0)}K</div>
                                <div class="text-muted">Revenue Collected</div>
                                <small class="text-warning">₨ ${(pendingFees / 1000).toFixed(0)}K pending</small>
                            </div>
                            <div class="bg-warning bg-opacity-10 p-2 rounded">
                                <i class="bi bi-wallet2 text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <i class="bi bi-person-badge fs-1 text-info"></i>
                                <div class="stat-value mt-2">${totalTeachers}</div>
                                <div class="text-muted">Faculty Members</div>
                                <small><i class="bi bi-trophy"></i> 8 PhDs</small>
                            </div>
                            <div class="bg-info bg-opacity-10 p-2 rounded">
                                <i class="bi bi-person-badge-fill text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Row -->
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="card-premium">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-semibold mb-0">
                                <i class="bi bi-bar-chart-steps me-2 text-primary"></i>
                                Enrollment by Department
                            </h5>
                            <span class="badge bg-primary bg-opacity-10 text-primary">2025</span>
                        </div>
                        <canvas id="enrollmentChart" height="250"></canvas>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card-premium">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-semibold mb-0">
                                <i class="bi bi-pie-chart me-2 text-success"></i>
                                GPA Distribution
                            </h5>
                            <span class="badge bg-success bg-opacity-10 text-success">Current</span>
                        </div>
                        <canvas id="gpaChart" height="250"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Top Students & Notifications Row -->
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card-premium">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-semibold mb-0">
                                <i class="bi bi-trophy-fill me-2 text-warning"></i>
                                Top Performing Students
                            </h5>
                            <button class="btn btn-sm btn-outline-primary" onclick="location.reload()">
                                <i class="bi bi-arrow-repeat"></i> Refresh
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th><i class="bi bi-person-circle"></i> Student Name</th>
                                        <th><i class="bi bi-mortarboard"></i> Program</th>
                                        <th><i class="bi bi-star-fill text-warning"></i> CGPA</th>
                                        <th><i class="bi bi-calendar-check"></i> Attendance</th>
                                        <th><i class="bi bi-trophy"></i> Rank</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${topStudents.map((s, index) => `
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-sm bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                                        <i class="bi bi-person-circle text-primary"></i>
                                                    </div>
                                                    <div>
                                                        <strong>${s.name}</strong><br>
                                                        <small class="text-muted">${s.id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${s.program}</td>
                                            <td>
                                                <span class="fw-bold ${s.cgpa >= 3.5 ? 'text-success' : s.cgpa >= 3.0 ? 'text-warning' : 'text-danger'}">
                                                    ${s.cgpa > 0 ? s.cgpa.toFixed(2) : 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="progress flex-grow-1 me-2" style="height: 6px;">
                                                        <div class="progress-bar ${attendanceStats.find(a => a.id === s.id)?.attendance >= 75 ? 'bg-success' : 'bg-warning'}" 
                                                             style="width: ${attendanceStats.find(a => a.id === s.id)?.attendance || 0}%">
                                                        </div>
                                                    </div>
                                                    <small>${attendanceStats.find(a => a.id === s.id)?.attendance || 0}%</small>
                                                </div>
                                            </td>
                                            <td>
                                                ${index === 0 ? '<i class="bi bi-trophy-fill text-warning"></i> Gold' :
                    index === 1 ? '<i class="bi bi-trophy-fill text-secondary"></i> Silver' :
                        index === 2 ? '<i class="bi bi-trophy-fill text-bronze"></i> Bronze' :
                            `${index + 1}th`}
                                            </td>
                                        </tr>
                                    `).join('')}
                                    ${topStudents.length === 0 ? `
                                        <tr>
                                            <td colspan="5" class="text-center text-muted">
                                                <i class="bi bi-inbox fs-1"></i><br>No students found
                                            </td>
                                        </tr>
                                    ` : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="card-premium">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-semibold mb-0">
                                <i class="bi bi-bell-fill me-2 text-info"></i>
                                Recent Notifications
                            </h5>
                            <span class="badge bg-danger">${notifications.filter(n => !n.read).length} New</span>
                        </div>
                        <div class="notification-list">
                            ${notifications.map(n => `
                                <div class="notification-item p-3 mb-2 border rounded-3 ${n.type === 'success' ? 'border-success' : n.type === 'warning' ? 'border-warning' : 'border-info'}">
                                    <div class="d-flex align-items-start">
                                        <div class="notification-icon me-3">
                                            <i class="bi bi-${n.type === 'success' ? 'check-circle-fill text-success' : n.type === 'warning' ? 'exclamation-triangle-fill text-warning' : 'info-circle-fill text-info'} fs-4"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex justify-content-between align-items-start">
                                                <h6 class="mb-1 fw-semibold">${n.title}</h6>
                                                <small class="text-muted">${new Date(n.date).toLocaleTimeString()}</small>
                                            </div>
                                            <p class="mb-0 small text-muted">${n.message}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            
<!-- Quick Actions Row -->
<div class="row g-4 mt-2">
    <div class="col-12">
        <div class="card-premium">
            <h5 class="fw-semibold mb-3">
                <i class="bi bi-lightning-charge-fill me-2 text-warning"></i>
                Quick Actions
            </h5>
            <div class="row g-3">
                <div class="col-md-3">
                    <button class="btn btn-outline-primary w-100 py-3" onclick="window.navigateToPage('students')">
                        <i class="bi bi-person-plus fs-4 d-block mb-2"></i>
                        Add New Student
                    </button>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-outline-success w-100 py-3" onclick="window.navigateToPage('courses')">
                        <i class="bi bi-book-plus fs-4 d-block mb-2"></i>
                        Create Course
                    </button>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-outline-info w-100 py-3" onclick="window.navigateToPage('attendance')">
                        <i class="bi bi-calendar-check fs-4 d-block mb-2"></i>
                        Mark Attendance
                    </button>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-outline-warning w-100 py-3" onclick="window.navigateToPage('fees')">
                        <i class="bi bi-cash-stack fs-4 d-block mb-2"></i>
                        Manage Fees
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
             </div>
        `;
        }




        else if (role === 'teacher') {
            // TEACHER DASHBOARD - Fixed with proper navigation
            const user = auth.getUser();
            const courses = (await api.getCourses()).data;
            const students = (await api.getStudents()).data;

            // Get teacher's courses (assuming teacher name matches)
            const teacherName = user.name;
            const myCourses = courses.filter(c => c.teacher === teacherName);

            // Get today's schedule
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const timetable = [
                { day: "Monday", time: "09:00-10:30", course: "CS201 - Data Structures", room: "Room 101" },
                { day: "Tuesday", time: "11:00-12:30", course: "CS301 - Database Systems", room: "Room 102" },
                { day: "Wednesday", time: "09:00-10:30", course: "CS101 - Programming", room: "Room 101" }
            ];
            const todaySchedule = timetable.filter(t => t.day === today);

            // Calculate statistics
            const totalStudents = students.length;
            const totalCourses = myCourses.length;

            return `
        <!-- Welcome Section -->
        <div class="alert alert-info alert-dismissible fade show mb-4" role="alert">
            <i class="bi bi-mortarboard-fill me-2"></i>
            <strong>Welcome back, ${teacherName}!</strong> You have ${totalCourses} courses to manage today.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        
        <!-- Statistics Cards -->
        <div class="row g-4 mb-4">
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <i class="bi bi-book fs-1 text-primary"></i>
                            <div class="stat-value mt-2">${totalCourses}</div>
                            <div class="text-muted">My Courses</div>
                            <small>This semester</small>
                        </div>
                        <div class="bg-primary bg-opacity-10 p-2 rounded">
                            <i class="bi bi-journal-bookmark-fill text-primary"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <i class="bi bi-people fs-1 text-success"></i>
                            <div class="stat-value mt-2">${totalStudents}</div>
                            <div class="text-muted">Total Students</div>
                            <small>Across all courses</small>
                        </div>
                        <div class="bg-success bg-opacity-10 p-2 rounded">
                            <i class="bi bi-people-fill text-success"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <i class="bi bi-calendar-check fs-1 text-warning"></i>
                            <div class="stat-value mt-2">${todaySchedule.length}</div>
                            <div class="text-muted">Today's Classes</div>
                            <small>${today}</small>
                        </div>
                        <div class="bg-warning bg-opacity-10 p-2 rounded">
                            <i class="bi bi-calendar-week-fill text-warning"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- My Courses Section -->
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="card-premium">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-semibold mb-0">
                            <i class="bi bi-book me-2 text-primary"></i>
                            My Assigned Courses
                        </h5>
                        <span class="badge bg-primary">${totalCourses} Courses</span>
                    </div>
                    ${myCourses.length > 0 ? `
                        <div class="list-group">
                            ${myCourses.map(course => `
                                <div class="list-group-item border-0 mb-2 rounded-3 shadow-sm">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1 fw-semibold">${course.name}</h6>
                                            <small class="text-muted">Code: ${course.code} | Credits: ${course.creditHours}</small>
                                            <br><small class="text-muted">Department: ${course.department}</small>
                                        </div>
                                        <div class="btn-group">
                                            <button class="btn btn-sm btn-outline-primary" onclick="window.navigateToPage('attendance')">
                                                <i class="bi bi-calendar-check"></i> Mark Attendance
                                            </button>
                                            <button class="btn btn-sm btn-outline-success" onclick="window.navigateToPage('results')">
                                                <i class="bi bi-trophy"></i> Enter Results
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-4">
                            <i class="bi bi-inbox fs-1 text-muted"></i>
                            <p class="mt-2">No courses assigned yet.</p>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- Today's Schedule -->
            <div class="col-md-6">
                <div class="card-premium">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-semibold mb-0">
                            <i class="bi bi-calendar-week me-2 text-info"></i>
                            Today's Schedule - ${today}
                        </h5>
                        <i class="bi bi-clock-history text-info"></i>
                    </div>
                    ${todaySchedule.length > 0 ? `
                        <div class="timeline">
                            ${todaySchedule.map(schedule => `
                                <div class="d-flex mb-3 p-3 border rounded-3">
                                    <div class="me-3">
                                        <div class="bg-info bg-opacity-10 rounded-circle p-2">
                                            <i class="bi bi-clock text-info"></i>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <h6 class="mb-1 fw-semibold">${schedule.course}</h6>
                                        <small class="text-muted">Time: ${schedule.time}</small>
                                        <br><small class="text-muted">Room: ${schedule.room}</small>
                                    </div>
                                    <button class="btn btn-sm btn-primary" onclick="window.navigateToPage('attendance')">
                                        Take Attendance
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-4">
                            <i class="bi bi-calendar-x fs-1 text-muted"></i>
                            <p class="mt-2">No classes scheduled for today.</p>
                            <small class="text-muted">Enjoy your free time!</small>
                        </div>
                    `}
                </div>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card text-center border-0 shadow-sm h-100">
                    <div class="card-body">
                        <i class="bi bi-calendar-check fs-1 text-primary"></i>
                        <h6 class="mt-2">Mark Attendance</h6>
                        <p class="small text-muted">Record student attendance for your classes</p>
                        <button class="btn btn-primary btn-sm" onclick="window.navigateToPage('attendance')">
                            <i class="bi bi-arrow-right"></i> Go to Attendance
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center border-0 shadow-sm h-100">
                    <div class="card-body">
                        <i class="bi bi-trophy fs-1 text-success"></i>
                        <h6 class="mt-2">Enter Results</h6>
                        <p class="small text-muted">Update student grades and performance</p>
                        <button class="btn btn-success btn-sm" onclick="window.navigateToPage('results')">
                            <i class="bi bi-arrow-right"></i> Go to Results
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center border-0 shadow-sm h-100">
                    <div class="card-body">
                        <i class="bi bi-calendar-week fs-1 text-info"></i>
                        <h6 class="mt-2">View Schedule</h6>
                        <p class="small text-muted">Check your complete weekly timetable</p>
                        <button class="btn btn-info btn-sm text-white" onclick="window.navigateToPage('timetable')">
                            <i class="bi bi-arrow-right"></i> View Timetable
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Recent Activity / Notifications -->
        <div class="row g-4 mt-2">
            <div class="col-12">
                <div class="card-premium">
                    <h5 class="fw-semibold mb-3">
                        <i class="bi bi-bell me-2 text-warning"></i>
                        Recent Activities
                    </h5>
                    <div class="list-group">
                        <div class="list-group-item border-0 bg-light rounded-3 mb-2">
                            <div class="d-flex align-items-center">
                                <div class="me-3">
                                    <i class="bi bi-check-circle-fill text-success"></i>
                                </div>
                                <div>
                                    <strong>Attendance marked</strong><br>
                                    <small class="text-muted">Today at 09:00 AM - CS201 class</small>
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item border-0 bg-light rounded-3">
                            <div class="d-flex align-items-center">
                                <div class="me-3">
                                    <i class="bi bi-pencil-square text-primary"></i>
                                </div>
                                <div>
                                    <strong>Results updated</strong><br>
                                    <small class="text-muted">Yesterday - Mid-term exam results</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
        }

        else if (role === 'student') {
            // Student dashboard
            const user = auth.getUser();
            const enrollments = (await api.getEnrollments(user.studentId)).data;
            const fees = (await api.getFees(user.studentId)).data;

            return `
            <div class="row g-4 mb-4">
                <div class="col-md-4">
                    <div class="stat-card">
                        <div class="stat-value">${enrollments.length}</div>
                        <div>Enrolled Courses</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card">
                        <div class="stat-value">3.75</div>
                        <div>Current CGPA</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card">
                        <div class="stat-value">85%</div>
                        <div>Attendance</div>
                    </div>
                </div>
            </div>
            <div class="card-premium">
                <h5>Welcome ${user.name}</h5>
                <p>Student Dashboard - Track your academic progress</p>
            </div>
        `;
        }

        return '<div class="card p-4">Dashboard loading...</div>';
    }

    async renderStudents() {
        const students = (await api.getStudents()).data;

        return `
            <div class="card-premium">
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <h4 class="fw-semibold"><i class="bi bi-people me-2"></i>Student Management</h4>
                    <button class="btn btn-primary" id="addStudentBtn">
                        <i class="bi bi-plus-lg"></i> Add New Student
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table data-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th><th>Program</th><th>Semester</th><th>CGPA</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map(s => `
                                <tr>
                                    <td>${s.id}</td>
                                    <td><i class="bi bi-person-circle me-1"></i>${s.name}</td>
                                    <td>${s.email}</td>
                                    <td>${s.program}</td>
                                    <td>Semester ${s.semester}</td>
                                    <td><span class="fw-bold">${s.cgpa || 'N/A'}</span></td>
                                    <td><span class="badge-active">${s.status}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editStudent('${s.id}')">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteStudent('${s.id}')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async renderCourses(role) {
        const courses = (await api.getCourses()).data;

        return `
            <div class="card-premium">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="fw-semibold"><i class="bi bi-book me-2"></i>Course Management</h4>
                    ${role === 'admin' ? `
                        <button class="btn btn-primary" id="addCourseBtn">
                            <i class="bi bi-plus-lg"></i> Add Course
                        </button>
                    ` : role === 'student' ? `
                        <button class="btn btn-primary" id="registerCourseBtn">
                            <i class="bi bi-plus-circle"></i> Register for Course
                        </button>
                    ` : ''}
                </div>
                <div class="table-responsive">
                    <table class="table data-table">
                        <thead>
                            <tr>
                                <th>Code</th><th>Course Name</th><th>Credit Hours</th><th>Department</th><th>Teacher</th><th>Prerequisites</th>
                                ${role === 'student' ? '<th>Action</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${courses.map(c => `
                                <tr>
                                    <td>${c.code}</td>
                                    <td>${c.name}</td>
                                    <td>${c.creditHours}</td>
                                    <td>${c.department}</td>
                                    <td>${c.teacher}</td>
                                    <td>${c.prerequisites}</td>
                                    ${role === 'student' ? `
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="window.registerForCourse('${c.id}')">
                                                <i class="bi bi-plus-circle"></i> Register
                                            </button>
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // async renderAttendance(role) {
    //     if (role === 'student') {
    //         const user = auth.getUser();
    //         const attendance = (await api.getAttendance(user.studentId)).data;

    //         const presentCount = attendance.filter(a => a.status === 'present').length;
    //         const percentage = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 0;

    //         return `
    //             <div class="card-premium">
    //                 <h4 class="fw-semibold"><i class="bi bi-calendar-check me-2"></i>My Attendance Record</h4>
    //                 <div class="row mb-4">
    //                     <div class="col-md-4">
    //                         <div class="stat-card">
    //                             <div class="stat-value">${percentage}%</div>
    //                             <div>Overall Attendance</div>
    //                             <small>${presentCount} / ${attendance.length} days present</small>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div class="table-responsive">
    //                     <table class="table data-table">
    //                         <thead>
    //                             <tr><th>Date</th><th>Course</th><th>Status</th></tr>
    //                         </thead>
    //                         <tbody>
    //                             ${attendance.map(a => `
    //                                 <tr>
    //                                     <td>${a.date}</td>
    //                                     <td>${a.courseId}</td>
    //                                     <td><span class="badge-${a.status === 'present' ? 'active' : 'pending'}">${a.status}</span></td>
    //                                 </tr>
    //                             `).join('')}
    //                         </tbody>
    //                     </table>
    //                 </div>
    //             </div>
    //         `;
    //     }

    //     // Teacher/Admin attendance marking interface
    //     const students = (await api.getStudents()).data;
    //     const courses = (await api.getCourses()).data;

    //     return `
    //         <div class="card-premium">
    //             <h4 class="fw-semibold mb-3"><i class="bi bi-calendar-check me-2"></i>Mark Attendance</h4>
    //             <div class="row mb-3">
    //                 <div class="col-md-4">
    //                     <input type="date" id="attendanceDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
    //                 </div>
    //                 <div class="col-md-4">
    //                     <select id="attendanceCourse" class="form-select">
    //                         <option value="">Select Course</option>
    //                         ${courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
    //                     </select>
    //                 </div>
    //                 <div class="col-md-4">
    //                     <button class="btn btn-primary" id="saveAttendanceBtn">
    //                         <i class="bi bi-save"></i> Save Attendance
    //                     </button>
    //                 </div>
    //             </div>
    //             <div class="table-responsive">
    //                 <table class="table data-table" id="attendanceTable">
    //                     <thead>
    //                         <tr><th>Student Name</th><th>Roll No</th><th>Status</th><th>Action</th></tr>
    //                     </thead>
    //                     <tbody>
    //                         ${students.map(s => `
    //                             <tr>
    //                                 <td>${s.name}</td>
    //                                 <td>${s.id}</td>
    //                                 <td><span id="status-${s.id}" class="badge-active">Present</span></td>
    //                                 <td>
    //                                     <div class="btn-group">
    //                                         <button class="btn btn-sm btn-success" onclick="window.markPresent('${s.id}')">
    //                                             <i class="bi bi-check-lg"></i> P
    //                                         </button>
    //                                         <button class="btn btn-sm btn-danger" onclick="window.markAbsent('${s.id}')">
    //                                             <i class="bi bi-x-lg"></i> A
    //                                         </button>
    //                                     </div>
    //                                 </td>
    //                             </tr>
    //                         `).join('')}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //     `;
    // }


    // async renderAttendance(role) {
    //     if (role === 'student') {
    //         const user = auth.getUser();
    //         const attendance = (await api.getAttendance(user.studentId)).data;

    //         const presentCount = attendance.filter(a => a.status === 'present').length;
    //         const percentage = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 0;

    //         return `
    //             <div class="card-premium">
    //                 <h4 class="fw-semibold"><i class="bi bi-calendar-check me-2"></i>My Attendance Record</h4>
    //                 <div class="row mb-4">
    //                     <div class="col-md-4">
    //                         <div class="stat-card">
    //                             <div class="stat-value">${percentage}%</div>
    //                             <div>Overall Attendance</div>
    //                             <small>${presentCount} / ${attendance.length} days present</small>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div class="table-responsive">
    //                     <table class="table data-table">
    //                         <thead>
    //                             <tr><th>Date</th><th>Course</th><th>Status</th></tr>
    //                         </thead>
    //                         <tbody>
    //                             ${attendance.map(a => `
    //                                 <tr>
    //                                     <td>${a.date}</td>
    //                                     <td>${a.courseId}</td>
    //                                     <td><span class="badge-${a.status === 'present' ? 'active' : 'pending'}">${a.status}</span></td>
    //                                 </tr>
    //                             `).join('')}
    //                         </tbody>
    //                     </table>
    //                 </div>
    //             </div>
    //         `;
    //     }

    //     // Admin/Teacher Attendance System with Detailed Reports
    //     const students = (await api.getStudents()).data;
    //     const courses = (await api.getCourses()).data;
    //     const enrollments = (await api.getEnrollments()).data;

    //     // Generate mock attendance data for demo (in real app, fetch from backend)
    //     const attendanceRecords = [];
    //     const last30Days = [];
    //     for (let i = 0; i < 30; i++) {
    //         const date = new Date();
    //         date.setDate(date.getDate() - i);
    //         last30Days.push(date.toISOString().split('T')[0]);
    //     }

    //     students.forEach(student => {
    //         courses.forEach(course => {
    //             last30Days.forEach(date => {
    //                 // Random attendance (70-95% present)
    //                 const isPresent = Math.random() > 0.15;
    //                 attendanceRecords.push({
    //                     id: `${student.id}-${course.id}-${date}`,
    //                     studentId: student.id,
    //                     studentName: student.name,
    //                     courseId: course.id,
    //                     courseName: course.name,
    //                     department: student.program,
    //                     semester: student.semester,
    //                     date: date,
    //                     status: isPresent ? 'present' : 'absent'
    //                 });
    //             });
    //         });
    //     });

    //     // Calculate attendance percentage for each student
    //     const studentAttendance = students.map(student => {
    //         const studentRecords = attendanceRecords.filter(a => a.studentId === student.id);
    //         const totalClasses = studentRecords.length;
    //         const presentClasses = studentRecords.filter(a => a.status === 'present').length;
    //         const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;

    //         return {
    //             ...student,
    //             attendancePercentage: parseFloat(percentage),
    //             totalClasses,
    //             presentClasses,
    //             absentClasses: totalClasses - presentClasses,
    //             status: percentage < 75 ? 'Low Attendance' : percentage < 85 ? 'Satisfactory' : 'Good'
    //         };
    //     });

    //     // Filter low attendance students (below 75%)
    //     const lowAttendanceStudents = studentAttendance.filter(s => s.attendancePercentage < 75);

    //     // Get unique departments
    //     const departments = [...new Set(students.map(s => s.program))];

    //     // Get unique semesters
    //     const semesters = [...new Set(students.map(s => s.semester))].sort();

    //     return `
    //         <!-- Warning Alert for Low Attendance -->
    //         ${lowAttendanceStudents.length > 0 ? `
    //             <div class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
    //                 <i class="bi bi-exclamation-triangle-fill me-2"></i>
    //                 <strong>⚠️ Attention Required!</strong> 
    //                 ${lowAttendanceStudents.length} students have attendance below 75%!
    //                 <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    //             </div>
    //         ` : ''}

    //         <!-- Mark Attendance Section -->
    //         <div class="card-premium mb-4">
    //             <h4 class="fw-semibold mb-3">
    //                 <i class="bi bi-calendar-check me-2 text-primary"></i>
    //                 Mark Today's Attendance
    //             </h4>
    //             <div class="row mb-3">
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">Select Date</label>
    //                     <input type="date" id="attendanceDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
    //                 </div>
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">Select Course</label>
    //                     <select id="attendanceCourse" class="form-select">
    //                         <option value="">All Courses</option>
    //                         ${courses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('')}
    //                     </select>
    //                 </div>
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">Select Department</label>
    //                     <select id="attendanceDepartment" class="form-select">
    //                         <option value="">All Departments</option>
    //                         ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
    //                     </select>
    //                 </div>
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">Select Semester</label>
    //                     <select id="attendanceSemester" class="form-select">
    //                         <option value="">All Semesters</option>
    //                         ${semesters.map(s => `<option value="${s}">Semester ${s}</option>`).join('')}
    //                     </select>
    //                 </div>
    //             </div>
    //             <div class="row mb-3">
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">Search by Roll No</label>
    //                     <input type="text" id="searchRollNo" class="form-control" placeholder="Enter Roll Number">
    //                 </div>
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">Search by Name</label>
    //                     <input type="text" id="searchStudentName" class="form-control" placeholder="Enter Student Name">
    //                 </div>
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">Attendance Filter</label>
    //                     <select id="attendanceFilter" class="form-select">
    //                         <option value="all">All Students</option>
    //                         <option value="low">Low Attendance (<75%)</option>
    //                         <option value="critical">Critical (<60%)</option>
    //                         <option value="good">Good (≥75%)</option>
    //                     </select>
    //                 </div>
    //                 <div class="col-md-3">
    //                     <label class="form-label fw-semibold">&nbsp;</label>
    //                     <button class="btn btn-primary w-100" onclick="window.applyAttendanceFilters()">
    //                         <i class="bi bi-funnel"></i> Apply Filters
    //                     </button>
    //                 </div>
    //             </div>
    //             <div class="table-responsive" id="attendanceTableContainer">
    //                 <!-- Attendance table will be loaded here -->
    //             </div>
    //             <div class="mt-3">
    //                 <button class="btn btn-success" onclick="window.saveAttendance()">
    //                     <i class="bi bi-save"></i> Save Attendance
    //                 </button>
    //                 <button class="btn btn-info ms-2" onclick="window.markAllPresent()">
    //                     <i class="bi bi-check-all"></i> Mark All Present
    //                 </button>
    //                 <button class="btn btn-warning ms-2" onclick="window.exportAttendanceReport()">
    //                     <i class="bi bi-download"></i> Export Report
    //                 </button>
    //             </div>
    //         </div>

    //         <!-- Low Attendance Report Section -->
    //         <div class="card-premium mb-4">
    //             <h4 class="fw-semibold mb-3">
    //                 <i class="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
    //                 Low Attendance Alert Report
    //                 <span class="badge bg-danger ms-2">${lowAttendanceStudents.length} Students</span>
    //             </h4>
    //             <div class="table-responsive">
    //                 <table class="table data-table">
    //                     <thead class="table-danger">
    //                         <tr>
    //                             <th>Roll Number</th>
    //                             <th>Student Name</th>
    //                             <th>Department</th>
    //                             <th>Semester</th>
    //                             <th>Section</th>
    //                             <th>Total Classes</th>
    //                             <th>Present</th>
    //                             <th>Absent</th>
    //                             <th>Attendance %</th>
    //                             <th>Status</th>
    //                             <th>Action</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         ${lowAttendanceStudents.map(s => `
    //                             <tr>
    //                                 <td><strong>${s.id}</strong></td>
    //                                 <td><i class="bi bi-person-circle me-1"></i>${s.name}</td>
    //                                 <td>${s.program}</td>
    //                                 <td>Semester ${s.semester}</td>
    //                                 <td>${s.semester % 2 === 0 ? 'A' : 'B'}</td>
    //                                 <td>${s.totalClasses}</td>
    //                                 <td>${s.presentClasses}</td>
    //                                 <td>${s.absentClasses}</td>
    //                                 <td>
    //                                     <div class="d-flex align-items-center">
    //                                         <div class="progress flex-grow-1 me-2" style="height: 8px;">
    //                                             <div class="progress-bar bg-danger" style="width: ${s.attendancePercentage}%"></div>
    //                                         </div>
    //                                         <span class="fw-bold text-danger">${s.attendancePercentage}%</span>
    //                                     </div>
    //                                  </td>
    //                                 <td>
    //                                     <span class="badge bg-danger">⚠️ Warning</span>
    //                                  </td>
    //                                 <td>
    //                                     <button class="btn btn-sm btn-warning" onclick="window.sendAlertToParent('${s.id}')">
    //                                         <i class="bi bi-envelope"></i> Alert Parent
    //                                     </button>
    //                                  </td>
    //                             </tr>
    //                         `).join('')}
    //                         ${lowAttendanceStudents.length === 0 ? `
    //                             <tr>
    //                                 <td colspan="11" class="text-center text-success">
    //                                     <i class="bi bi-check-circle-fill fs-1"></i><br>
    //                                     Great! No students with low attendance!
    //                                 </td>
    //                             </tr>
    //                         ` : ''}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>

    //         <!-- Department-wise Attendance Summary -->
    //         <div class="card-premium mb-4">
    //             <h4 class="fw-semibold mb-3">
    //                 <i class="bi bi-building me-2 text-info"></i>
    //                 Department-wise Attendance Summary
    //             </h4>
    //             <div class="row">
    //                 ${departments.map(dept => {
    //                     const deptStudents = studentAttendance.filter(s => s.program === dept);
    //                     const avgAttendance = deptStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / deptStudents.length;
    //                     const lowCount = deptStudents.filter(s => s.attendancePercentage < 75).length;
    //                     const goodCount = deptStudents.filter(s => s.attendancePercentage >= 75).length;

    //                     return `
    //                         <div class="col-md-4 mb-3">
    //                             <div class="card border-0 shadow-sm">
    //                                 <div class="card-body">
    //                                     <h6 class="fw-semibold">${dept}</h6>
    //                                     <div class="mb-2">
    //                                         <div class="d-flex justify-content-between mb-1">
    //                                             <small>Average Attendance</small>
    //                                             <small class="fw-bold ${avgAttendance < 75 ? 'text-danger' : 'text-success'}">${avgAttendance.toFixed(1)}%</small>
    //                                         </div>
    //                                         <div class="progress" style="height: 6px;">
    //                                             <div class="progress-bar ${avgAttendance < 75 ? 'bg-danger' : 'bg-success'}" 
    //                                                  style="width: ${avgAttendance}%"></div>
    //                                         </div>
    //                                     </div>
    //                                     <div class="row mt-3">
    //                                         <div class="col-6">
    //                                             <small class="text-muted">Total Students</small>
    //                                             <br><strong>${deptStudents.length}</strong>
    //                                         </div>
    //                                         <div class="col-6">
    //                                             <small class="text-muted">Low Attendance</small>
    //                                             <br><strong class="text-danger">${lowCount}</strong>
    //                                         </div>
    //                                     </div>
    //                                     <div class="mt-2">
    //                                         <div class="progress" style="height: 20px;">
    //                                             <div class="progress-bar bg-danger" style="width: ${(lowCount/deptStudents.length)*100}%">
    //                                                 ${lowCount} Low
    //                                             </div>
    //                                             <div class="progress-bar bg-success" style="width: ${(goodCount/deptStudents.length)*100}%">
    //                                                 ${goodCount} Good
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     `;
    //                 }).join('')}
    //             </div>
    //         </div>

    //         <!-- Complete Attendance Report -->
    //         <div class="card-premium">
    //             <h4 class="fw-semibold mb-3">
    //                 <i class="bi bi-table me-2 text-primary"></i>
    //                 Complete Attendance Report
    //             </h4>
    //             <div class="table-responsive">
    //                 <table class="table data-table" id="completeAttendanceTable">
    //                     <thead>
    //                         <tr>
    //                             <th>Roll Number</th>
    //                             <th>Student Name</th>
    //                             <th>Department</th>
    //                             <th>Section</th>
    //                             <th>Semester</th>
    //                             <th>Total Classes</th>
    //                             <th>Present</th>
    //                             <th>Absent</th>
    //                             <th>Attendance %</th>
    //                             <th>Status</th>
    //                             <th>Performance</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody id="attendanceTableBody">
    //                         ${studentAttendance.map(s => `
    //                             <tr>
    //                                 <td><strong>${s.id}</strong></td>
    //                                 <td><i class="bi bi-person-circle me-1"></i>${s.name}</td>
    //                                 <td>${s.program}</td>
    //                                 <td>${s.semester % 2 === 0 ? 'A' : 'B'}</td>
    //                                 <td>Semester ${s.semester}</td>
    //                                 <td>${s.totalClasses}</td>
    //                                 <td>${s.presentClasses}</td>
    //                                 <td>${s.absentClasses}</td>
    //                                 <td>
    //                                     <div class="d-flex align-items-center">
    //                                         <div class="progress flex-grow-1 me-2" style="height: 8px;">
    //                                             <div class="progress-bar ${s.attendancePercentage >= 75 ? 'bg-success' : s.attendancePercentage >= 60 ? 'bg-warning' : 'bg-danger'}" 
    //                                                  style="width: ${s.attendancePercentage}%"></div>
    //                                         </div>
    //                                         <span class="fw-bold ${s.attendancePercentage >= 75 ? 'text-success' : s.attendancePercentage >= 60 ? 'text-warning' : 'text-danger'}">
    //                                             ${s.attendancePercentage}%
    //                                         </span>
    //                                     </div>
    //                                  </td>
    //                                 <td>
    //                                     ${s.attendancePercentage >= 75 ? '<span class="badge bg-success">✅ Good</span>' : 
    //                                       s.attendancePercentage >= 60 ? '<span class="badge bg-warning">⚠️ Satisfactory</span>' : 
    //                                       '<span class="badge bg-danger">❌ Critical</span>'}
    //                                  </td>
    //                                 <td>
    //                                     <div class="progress" style="height: 30px;">
    //                                         <div class="progress-bar bg-success" style="width: ${s.attendancePercentage}%">
    //                                             ${s.attendancePercentage}%
    //                                         </div>
    //                                     </div>
    //                                  </td>
    //                             </tr>
    //                         `).join('')}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //     `;
    // }

    async renderAttendance(role) {
        if (role === 'student') {
            const user = auth.getUser();
            const attendance = (await api.getAttendance(user.studentId)).data;

            const presentCount = attendance.filter(a => a.status === 'present').length;
            const percentage = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 0;

            return `
            <div class="card-premium">
                <h4 class="fw-semibold"><i class="bi bi-calendar-check me-2"></i>My Attendance Record</h4>
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-value">${percentage}%</div>
                            <div>Overall Attendance</div>
                            <small>${presentCount} / ${attendance.length} days present</small>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table data-table">
                        <thead>
                            <tr><th>Date</th><th>Course</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${attendance.map(a => `
                                <tr>
                                    <td>${a.date}</td>
                                    <td>${a.courseId}</td>
                                    <td><span class="badge-${a.status === 'present' ? 'active' : 'pending'}">${a.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        }

        // Admin/Teacher Attendance System
        const students = (await api.getStudents()).data;
        const courses = (await api.getCourses()).data;

        // Calculate attendance percentage for each student (using mock data)
        const studentAttendance = students.map(student => {
            // Mock attendance data - in real app, fetch from backend
            const totalClasses = 30;
            const presentClasses = Math.floor(Math.random() * 30) + 15; // Random 15-45
            const percentage = ((presentClasses / totalClasses) * 100).toFixed(1);

            return {
                ...student,
                attendancePercentage: parseFloat(percentage),
                totalClasses: totalClasses,
                presentClasses: presentClasses,
                absentClasses: totalClasses - presentClasses,
                section: student.semester % 2 === 0 ? 'A' : 'B',
                status: percentage < 75 ? '⚠️ Low Attendance' : percentage < 85 ? '✅ Satisfactory' : '⭐ Excellent'
            };
        });

        // Filter low attendance students
        const lowAttendanceStudents = studentAttendance.filter(s => s.attendancePercentage < 75);

        // Get departments
        const departments = [...new Set(students.map(s => s.program))];

        return `
        <!-- Low Attendance Alert -->
        ${lowAttendanceStudents.length > 0 ? `
            <div class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>⚠️ ATTENTION REQUIRED!</strong> 
                ${lowAttendanceStudents.length} student(s) have attendance below 75%!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        ` : `
            <div class="alert alert-success mb-4">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Great! All students have good attendance (≥75%)</strong>
            </div>
        `}
        
        <!-- Mark Attendance Section -->
        <div class="card-premium mb-4">
            <h4 class="fw-semibold mb-3">
                <i class="bi bi-calendar-check me-2 text-primary"></i>
                Mark Today's Attendance
            </h4>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label class="form-label fw-semibold">Select Date</label>
                    <input type="date" id="attendanceDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-semibold">Select Course</label>
                    <select id="attendanceCourse" class="form-select">
                        <option value="">Select Course</option>
                        ${courses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-semibold">Select Department</label>
                    <select id="attendanceDepartmentFilter" class="form-select">
                        <option value="all">All Departments</option>
                        ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- Students Attendance Table -->
            <div class="table-responsive">
                <table class="table data-table" id="attendanceStudentsTable">
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Student Name</th>
                            <th>Department</th>
                            <th>Section</th>
                            <th>Semester</th>
                            <th>Attendance Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="attendanceStudentsList">
                        ${studentAttendance.map(s => `
                            <tr data-department="${s.program}" data-semester="${s.semester}">
                                <td><strong>${s.id}</strong></td>
                                <td><i class="bi bi-person-circle me-1"></i>${s.name}</td>
                                <td>${s.program}</td>
                                <td>Section ${s.section}</td>
                                <td>Semester ${s.semester}</td>
                                <td>
                                    <span id="status-${s.id}" class="badge bg-success">Present</span>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-success" onclick="window.markStudentPresent('${s.id}')">
                                            <i class="bi bi-check-lg"></i> P
                                        </button>
                                        <button class="btn btn-danger" onclick="window.markStudentAbsent('${s.id}')">
                                            <i class="bi bi-x-lg"></i> A
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="mt-3">
                <button class="btn btn-success" onclick="window.saveTodayAttendance()">
                    <i class="bi bi-save"></i> Save Attendance
                </button>
                <button class="btn btn-info ms-2" onclick="window.markAllPresentToday()">
                    <i class="bi bi-check-all"></i> Mark All Present
                </button>
                <button class="btn btn-primary ms-2" onclick="window.filterAttendanceByDepartment()">
                    <i class="bi bi-funnel"></i> Filter by Department
                </button>
                <button class="btn btn-secondary ms-2" onclick="window.resetAttendanceFilter()">
                    <i class="bi bi-arrow-repeat"></i> Reset Filter
                </button>
            </div>
        </div>
        
        <!-- Low Attendance Students Report -->
        <div class="card-premium mb-4">
            <h4 class="fw-semibold mb-3">
                <i class="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                Students with Low Attendance (&lt;75%)
                <span class="badge bg-danger ms-2">${lowAttendanceStudents.length} Students</span>
            </h4>
            
            ${lowAttendanceStudents.length > 0 ? `
                <div class="table-responsive">
                    <table class="table data-table">
                        <thead class="table-danger">
                            <tr>
                                <th>Roll Number</th>
                                <th>Student Name</th>
                                <th>Department</th>
                                <th>Section</th>
                                <th>Semester</th>
                                <th>Total Classes</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Attendance %</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lowAttendanceStudents.map(s => `
                                <tr>
                                    <td><strong>${s.id}</strong></td>
                                    <td><i class="bi bi-person-circle me-1"></i>${s.name}</td>
                                    <td>${s.program}</td>
                                    <td>Section ${s.section}</td>
                                    <td>Semester ${s.semester}</td>
                                    <td>${s.totalClasses}</td>
                                    <td>${s.presentClasses}</td>
                                    <td>${s.absentClasses}</td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="progress flex-grow-1 me-2" style="height: 8px; width: 100px;">
                                                <div class="progress-bar bg-danger" style="width: ${s.attendancePercentage}%"></div>
                                            </div>
                                            <span class="fw-bold text-danger">${s.attendancePercentage}%</span>
                                        </div>
                                    </td>
                                    <td><span class="badge bg-danger">⚠️ Warning</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" onclick="window.sendParentAlert('${s.id}', '${s.name}')">
                                            <i class="bi bi-envelope"></i> Alert Parent
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="text-center py-4">
                    <i class="bi bi-check-circle-fill text-success fs-1"></i>
                    <p class="mt-2 mb-0">No students with low attendance!</p>
                </div>
            `}
        </div>
        
        <!-- Department-wise Summary -->
        <div class="card-premium">
            <h4 class="fw-semibold mb-3">
                <i class="bi bi-building me-2 text-info"></i>
                Department-wise Attendance Summary
            </h4>
            <div class="row">
                ${departments.map(dept => {
            const deptStudents = studentAttendance.filter(s => s.program === dept);
            const avgAttendance = deptStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / deptStudents.length;
            const lowCount = deptStudents.filter(s => s.attendancePercentage < 75).length;
            const deptStatus = avgAttendance >= 75 ? 'success' : 'danger';

            return `
                        <div class="col-md-4 mb-3">
                            <div class="card border-0 shadow-sm">
                                <div class="card-body">
                                    <h6 class="fw-semibold">${dept}</h6>
                                    <div class="mb-2">
                                        <div class="d-flex justify-content-between mb-1">
                                            <small>Average Attendance</small>
                                            <small class="fw-bold text-${deptStatus}">${avgAttendance.toFixed(1)}%</small>
                                        </div>
                                        <div class="progress" style="height: 8px;">
                                            <div class="progress-bar bg-${deptStatus}" style="width: ${avgAttendance}%"></div>
                                        </div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-6">
                                            <small class="text-muted">Total Students</small>
                                            <br><strong>${deptStudents.length}</strong>
                                        </div>
                                        <div class="col-6">
                                            <small class="text-muted">Low Attendance</small>
                                            <br><strong class="text-danger">${lowCount}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        </div>
    `;
    }

    async renderResults(role) {
        const user = auth.getUser();
        let enrollments = [];

        if (role === 'student') {
            enrollments = (await api.getEnrollments(user.studentId)).data;
        } else {
            enrollments = (await api.getEnrollments()).data;
        }

        const students = await api.getStudents();
        const courses = await api.getCourses();

        return `
            <div class="card-premium">
                <h4 class="fw-semibold"><i class="bi bi-trophy me-2"></i>Result & Grading System</h4>
                <div class="table-responsive">
                    <table class="table data-table">
                        <thead>
                            <tr>
                                <th>Student</th><th>Course</th><th>Semester</th><th>Marks</th><th>Grade</th><th>GPA</th><th>Status</th>
                                ${role !== 'student' ? '<th>Action</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${enrollments.map(e => {
            const student = students.data.find(s => s.id === e.studentId);
            const course = courses.data.find(c => c.id === e.courseId);
            return `
                                    <tr>
                                        <td>${student?.name || e.studentId}</td>
                                        <td>${course?.name || e.courseId}</td>
                                        <td>${e.semester}</td>
                                        <td>
                                            <input type="number" id="marks-${e.id}" value="${e.marks}" 
                                                   class="form-control form-control-sm" style="width: 80px;" 
                                                   ${role === 'student' ? 'disabled' : ''}>
                                        </td>
                                        <td>${e.grade}</td>
                                        <td>${e.gpa}</td>
                                        <td><span class="badge-${e.status === 'completed' ? 'active' : 'pending'}">${e.status}</span></td>
                                        ${role !== 'student' ? `
                                            <td>
                                                <button class="btn btn-sm btn-primary" onclick="window.updateMarks(${e.id})">
                                                    <i class="bi bi-save"></i> Update
                                                </button>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async renderFees(role) {
        const user = auth.getUser();
        let fees = [];

        if (role === 'student') {
            fees = (await api.getFees(user.studentId)).data;
        } else {
            fees = (await api.getFees()).data;
        }

        const students = await api.getStudents();
        const totalCollected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
        const totalPending = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

        return `
            <div class="card-premium">
                <h4 class="fw-semibold"><i class="bi bi-wallet2 me-2"></i>Fee Management System</h4>
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="stat-card p-2">
                            <div class="stat-value">₨ ${(totalCollected / 1000).toFixed(0)}K</div>
                            <div>Total Collected</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card p-2">
                            <div class="stat-value text-warning">₨ ${(totalPending / 1000).toFixed(0)}K</div>
                            <div>Pending Dues</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card p-2">
                            <div class="stat-value text-success">${totalCollected + totalPending > 0 ? ((totalCollected / (totalCollected + totalPending)) * 100).toFixed(0) : 0}%</div>
                            <div>Collection Rate</div>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table data-table">
                        <thead>
                            <tr>
                                <th>Student</th><th>Semester</th><th>Amount (₨)</th><th>Due Date</th><th>Status</th>
                                ${role !== 'student' ? '<th>Action</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${fees.map(f => {
            const student = students.data.find(s => s.id === f.studentId);
            return `
                                    <tr>
                                        <td>${student?.name || f.studentId}</td>
                                        <td>${f.semester}</td>
                                        <td>${f.amount.toLocaleString()}</td>
                                        <td>${f.dueDate}</td>
                                        <td><span class="badge-${f.status}">${f.status}</span></td>
                                        ${role !== 'student' && f.status === 'pending' ? `
                                            <td>
                                                <button class="btn btn-sm btn-success" onclick="window.payFee(${f.id})">
                                                    <i class="bi bi-check2-circle"></i> Mark Paid
                                                </button>
                                            </td>
                                        ` : role === 'student' && f.status === 'pending' ? `
                                            <td>
                                                <button class="btn btn-sm btn-success" onclick="window.payFee(${f.id})">
                                                    <i class="bi bi-credit-card"></i> Pay Now
                                                </button>
                                            </td>
                                        ` : '<td>-</td>'}
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // renderTimetable() {
    //     const timetable = [
    //         { day: "Monday", time: "09:00-10:30", course: "CS201 - Data Structures", room: "Room 101", teacher: "Dr. Sarah Ahmed" },
    //         { day: "Monday", time: "11:00-12:30", course: "CS301 - Database Systems", room: "Room 102", teacher: "Dr. Fatima Zaidi" },
    //         { day: "Tuesday", time: "09:00-10:30", course: "BA101 - Management", room: "Room 201", teacher: "Prof. Imran Khan" },
    //         { day: "Tuesday", time: "11:00-12:30", course: "CS101 - Programming", room: "Room 101", teacher: "Dr. Sarah Ahmed" },
    //         { day: "Wednesday", time: "09:00-10:30", course: "CS201 - Data Structures Lab", room: "Lab 1", teacher: "Dr. Sarah Ahmed" },
    //         { day: "Thursday", time: "10:00-11:30", course: "CS301 - Database Lab", room: "Lab 2", teacher: "Dr. Fatima Zaidi" },
    //         { day: "Friday", time: "09:00-10:30", course: "BA101 - Management", room: "Room 201", teacher: "Prof. Imran Khan" }
    //     ];

    //     return `
    //         <div class="card-premium">
    //             <h4 class="fw-semibold"><i class="bi bi-calendar-week me-2"></i>Class Schedule / Timetable</h4>
    //             <div class="table-responsive">
    //                 <table class="table data-table">
    //                     <thead>
    //                         <tr><th>Day</th><th>Time</th><th>Course</th><th>Room</th><th>Teacher</th></tr>
    //                     </thead>
    //                     <tbody>
    //                         ${timetable.map(t => `
    //                             <tr>
    //                                 <td><strong>${t.day}</strong></td>
    //                                 <td>${t.time}</td>
    //                                 <td>${t.course}</td>
    //                                 <td>${t.room}</td>
    //                                 <td>${t.teacher}</td>
    //                             </tr>
    //                         `).join('')}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //     `;
    // }

    renderTimetable() {
        return `
        <div class="card-premium">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-semibold mb-0">
                    <i class="bi bi-calendar-week me-2 text-primary"></i>
                    Class Schedule / Timetable
                </h4>
                <button class="btn btn-primary" onclick="window.showAddScheduleModal()">
                    <i class="bi bi-plus-lg"></i> Add Schedule Entry
                </button>
            </div>
            
            <!-- Filter Section -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <label class="form-label fw-semibold">Filter by Day</label>
                    <select id="filterDay" class="form-select" onchange="window.filterTimetable()">
                        <option value="">All Days</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">Filter by Section</label>
                    <select id="filterSection" class="form-select" onchange="window.filterTimetable()">
                        <option value="">All Sections</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">Filter by Semester</label>
                    <select id="filterSemester" class="form-select" onchange="window.filterTimetable()">
                        <option value="">All Semesters</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">&nbsp;</label>
                    <button class="btn btn-secondary w-100" onclick="window.resetTimetableFilters()">
                        <i class="bi bi-arrow-repeat"></i> Reset Filters
                    </button>
                </div>
            </div>
            
            <!-- Timetable Table -->
            <div class="table-responsive">
                <table class="table data-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Room</th>
                            <th>Teacher</th>
                            <th>Section</th>
                            <th>Semester</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="timetableTableBody">
                        <tr><td colspan="9" class="text-center">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Add/Edit Schedule Modal -->
        <div class="modal fade" id="scheduleModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalTitle">Add Schedule Entry</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="scheduleForm">
                            <input type="hidden" id="entryId" value="">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Day *</label>
                                    <select id="scheduleDay" class="form-select" required>
                                        <option value="">Select Day</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Time *</label>
                                    <input type="time" id="scheduleTime" class="form-control" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Course Code *</label>
                                    <input type="text" id="scheduleCourseCode" class="form-control" placeholder="e.g., CS101" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Course Name *</label>
                                    <input type="text" id="scheduleCourseName" class="form-control" placeholder="e.g., Programming Fundamentals" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Room *</label>
                                    <input type="text" id="scheduleRoom" class="form-control" placeholder="e.g., Room 101" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Teacher</label>
                                    <input type="text" id="scheduleTeacher" class="form-control" placeholder="Teacher name">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Section</label>
                                    <select id="scheduleSection" class="form-select">
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-semibold">Semester</label>
                                    <select id="scheduleSemester" class="form-select">
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                        <option value="3">Semester 3</option>
                                        <option value="4">Semester 4</option>
                                        <option value="5">Semester 5</option>
                                        <option value="6">Semester 6</option>
                                        <option value="7">Semester 7</option>
                                        <option value="8">Semester 8</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="window.saveScheduleEntry()">Save Entry</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    attachPageHandlers(page, role) {
        // Student CRUD handlers
        window.editStudent = async (id) => {
            const newName = prompt("Enter new name:");
            if (newName) {
                await api.updateStudent(id, { name: newName });
                alert('Student updated!');
                this.loadPageData('students', role);
            }
        };

        window.deleteStudent = async (id) => {
            if (confirm('Delete this student?')) {
                await api.deleteStudent(id);
                alert('Student deleted!');
                this.loadPageData('students', role);
            }
        };

        window.registerForCourse = async (courseId) => {
            const user = auth.getUser();
            await api.createEnrollment({
                studentId: user.studentId,
                courseId: courseId,
                semester: "Spring 2025"
            });
            alert('Registered for course!');
            this.loadPageData('courses', role);
        };

        window.updateMarks = async (enrollmentId) => {
            const marksInput = document.getElementById(`marks-${enrollmentId}`);
            if (marksInput) {
                const marks = parseInt(marksInput.value);
                await api.updateEnrollment(enrollmentId, { marks });
                alert('Marks updated!');
                this.loadPageData('results', role);
            }
        };

        window.payFee = async (feeId) => {
            await api.payFee(feeId);
            alert('Payment recorded!');
            this.loadPageData('fees', role);
        };

        window.markPresent = (studentId) => {
            document.getElementById(`status-${studentId}`).innerHTML = '<span class="badge-active">Present</span>';
        };

        window.markAbsent = (studentId) => {
            document.getElementById(`status-${studentId}`).innerHTML = '<span class="badge-pending">Absent</span>';
        };

        // Add button handlers
        const addStudentBtn = document.getElementById('addStudentBtn');
        if (addStudentBtn) {
            addStudentBtn.onclick = async () => {
                const name = prompt("Student name:");
                const email = prompt("Email:");
                const program = prompt("Program:");
                if (name && email && program) {
                    await api.createStudent({ name, email, program });
                    alert('Student added!');
                    this.loadPageData('students', role);
                }
            };
        }

        const addCourseBtn = document.getElementById('addCourseBtn');
        if (addCourseBtn) {
            addCourseBtn.onclick = async () => {
                const name = prompt("Course name:");
                const code = prompt("Course code:");
                if (name && code) {
                    await api.createCourse({ name, code });
                    alert('Course added!');
                    this.loadPageData('courses', role);
                }
            };
        }

        const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
        if (saveAttendanceBtn) {
            saveAttendanceBtn.onclick = async () => {
                const date = document.getElementById('attendanceDate').value;
                const courseId = document.getElementById('attendanceCourse').value;

                if (!date || !courseId) {
                    alert('Please select date and course');
                    return;
                }

                alert('Attendance saved successfully!');
            };
        }




        if (page === 'attendance') {
            // Make functions available globally
            window.markStudentPresent = (id) => this.markStudentPresent(id);
            window.markStudentAbsent = (id) => this.markStudentAbsent(id);
            window.saveTodayAttendance = () => this.saveTodayAttendance();
            window.markAllPresentToday = () => this.markAllPresentToday();
            window.filterAttendanceByDepartment = () => this.filterAttendanceByDepartment();
            window.resetAttendanceFilter = () => this.resetAttendanceFilter();
            window.sendParentAlert = (id, name) => this.sendParentAlert(id, name);
        }


        // Timetable handlers
        if (page === 'timetable') {
            window.showAddScheduleModal = () => this.showAddScheduleModal();
            window.editScheduleEntry = (id) => this.editScheduleEntry(id);
            window.deleteScheduleEntry = (id) => this.deleteScheduleEntry(id);
            window.filterTimetable = () => this.filterTimetable();
            window.resetTimetableFilters = () => this.resetTimetableFilters();
            window.saveScheduleEntry = () => this.saveScheduleEntry();

            // Load timetable data
            this.loadTimetable();
        }

        // Navigation helper for all pages
        window.navigateToPage = (pageName) => {
            // Find and click the corresponding sidebar link
            const link = document.querySelector(`[data-page="${pageName}"]`);
            if (link) {
                link.click();
            } else {
                // If not found in sidebar, try to find in quick actions
                this.currentPage = pageName;
                this.loadPageData(pageName, auth.getRole());
            }
        };


    }

    // Add these methods to your UniversityApp class (before the closing brace)

    markStudentPresent(studentId) {
        const statusSpan = document.getElementById(`status-${studentId}`);
        if (statusSpan) {
            statusSpan.innerHTML = '<span class="badge bg-success">Present</span>';
            statusSpan.className = 'badge bg-success';
        }
    }

    markStudentAbsent(studentId) {
        const statusSpan = document.getElementById(`status-${studentId}`);
        if (statusSpan) {
            statusSpan.innerHTML = '<span class="badge bg-danger">Absent</span>';
            statusSpan.className = 'badge bg-danger';
        }
    }

    saveTodayAttendance() {
        const date = document.getElementById('attendanceDate')?.value;
        const course = document.getElementById('attendanceCourse')?.value;

        if (!date) {
            this.showToast('Please select a date', 'error');
            return;
        }

        if (!course) {
            this.showToast('Please select a course', 'error');
            return;
        }

        // Collect all attendance statuses
        const students = document.querySelectorAll('#attendanceStudentsList tr');
        let presentCount = 0;
        let absentCount = 0;

        students.forEach(row => {
            const statusBadge = row.querySelector('.badge');
            if (statusBadge && statusBadge.innerText === 'Present') {
                presentCount++;
            } else {
                absentCount++;
            }
        });

        this.showToast(`Attendance saved for ${date} - Present: ${presentCount}, Absent: ${absentCount}`, 'success');
    }

    markAllPresentToday() {
        const students = document.querySelectorAll('#attendanceStudentsList tr');
        students.forEach(row => {
            const studentId = row.cells[0]?.innerText;
            if (studentId) {
                this.markStudentPresent(studentId);
            }
        });
        this.showToast('All students marked as present', 'success');
    }

    filterAttendanceByDepartment() {
        const selectedDept = document.getElementById('attendanceDepartmentFilter')?.value;
        if (!selectedDept || selectedDept === 'all') {
            this.resetAttendanceFilter();
            return;
        }

        const rows = document.querySelectorAll('#attendanceStudentsList tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const dept = row.getAttribute('data-department');
            if (dept === selectedDept) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        this.showToast(`Showing ${visibleCount} students from ${selectedDept}`, 'success');
    }

    resetAttendanceFilter() {
        const rows = document.querySelectorAll('#attendanceStudentsList tr');
        rows.forEach(row => {
            row.style.display = '';
        });
        document.getElementById('attendanceDepartmentFilter').value = 'all';
        this.showToast('Filter reset - showing all students', 'success');
    }

    sendParentAlert(studentId, studentName) {
        this.showToast(`Alert sent to parents of ${studentName} (${studentId})`, 'warning');
    }



    // ============ TIMETABLE METHODS ============
    async loadTimetable() {
        try {
            const day = document.getElementById('filterDay')?.value || '';
            const section = document.getElementById('filterSection')?.value || '';
            const semester = document.getElementById('filterSemester')?.value || '';

            const response = await api.getTimetable(day, section, semester);
            const timetable = response.data;

            const tbody = document.getElementById('timetableTableBody');

            if (timetable.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No schedule entries found</td></tr>';
                return;
            }

            tbody.innerHTML = timetable.map(entry => `
            <tr>
                <td><strong>${entry.day}</strong></td>
                <td>${entry.time}</td>
                <td><span class="badge bg-primary">${entry.courseCode || entry.course.split(' - ')[0]}</span></td>
                <td>${entry.course}</td>
                <td><i class="bi bi-door-closed"></i> ${entry.room}</td>
                <td><i class="bi bi-person-badge"></i> ${entry.teacher}</td>
                <td><span class="badge bg-info">Section ${entry.section}</span></td>
                <td><span class="badge bg-secondary">Semester ${entry.semester}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="window.editScheduleEntry(${entry.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.deleteScheduleEntry(${entry.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
        } catch (error) {
            console.error('Error loading timetable:', error);
            document.getElementById('timetableTableBody').innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error loading timetable</td></tr>';
        }
    }

    async showAddScheduleModal() {
        document.getElementById('modalTitle').innerText = 'Add Schedule Entry';
        document.getElementById('entryId').value = '';
        document.getElementById('scheduleForm').reset();
        document.getElementById('scheduleDay').value = '';
        document.getElementById('scheduleTime').value = '';
        document.getElementById('scheduleCourseCode').value = '';
        document.getElementById('scheduleCourseName').value = '';
        document.getElementById('scheduleRoom').value = '';
        document.getElementById('scheduleTeacher').value = '';
        document.getElementById('scheduleSection').value = 'A';
        document.getElementById('scheduleSemester').value = '1';

        const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
        modal.show();
    }

    async editScheduleEntry(id) {
        try {
            const response = await api.getTimetableEntry(id);
            const entry = response.data;

            document.getElementById('modalTitle').innerText = 'Edit Schedule Entry';
            document.getElementById('entryId').value = entry.id;
            document.getElementById('scheduleDay').value = entry.day;

            // Convert time to HH:MM format for time input
            const timeParts = entry.time.split('-');
            if (timeParts[0]) {
                document.getElementById('scheduleTime').value = timeParts[0].trim();
            }

            document.getElementById('scheduleCourseCode').value = entry.courseCode || entry.course.split(' - ')[0];
            document.getElementById('scheduleCourseName').value = entry.course;
            document.getElementById('scheduleRoom').value = entry.room;
            document.getElementById('scheduleTeacher').value = entry.teacher;
            document.getElementById('scheduleSection').value = entry.section;
            document.getElementById('scheduleSemester').value = entry.semester;

            const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
            modal.show();
        } catch (error) {
            this.showToast('Error loading schedule entry', 'error');
        }
    }

    async saveScheduleEntry() {
        const id = document.getElementById('entryId').value;
        const day = document.getElementById('scheduleDay').value;
        const time = document.getElementById('scheduleTime').value;
        const courseCode = document.getElementById('scheduleCourseCode').value;
        const courseName = document.getElementById('scheduleCourseName').value;
        const room = document.getElementById('scheduleRoom').value;
        const teacher = document.getElementById('scheduleTeacher').value;
        const section = document.getElementById('scheduleSection').value;
        const semester = document.getElementById('scheduleSemester').value;

        if (!day || !time || !courseCode || !courseName || !room) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        const course = `${courseCode} - ${courseName}`;
        const fullTime = `${time}-${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:${time.split(':')[1]}`;

        const entryData = {
            day,
            time: fullTime,
            course,
            courseCode,
            room,
            teacher: teacher || 'TBD',
            section,
            semester: parseInt(semester)
        };

        try {
            if (id) {
                await api.updateTimetableEntry(id, entryData);
                this.showToast('Schedule entry updated successfully!', 'success');
            } else {
                await api.createTimetableEntry(entryData);
                this.showToast('Schedule entry added successfully!', 'success');
            }

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleModal'));
            modal.hide();

            // Reload timetable
            this.loadTimetable();
        } catch (error) {
            this.showToast('Error saving schedule entry', 'error');
        }
    }

    async deleteScheduleEntry(id) {
        if (confirm('Are you sure you want to delete this schedule entry?')) {
            try {
                await api.deleteTimetableEntry(id);
                this.showToast('Schedule entry deleted successfully!', 'success');
                this.loadTimetable();
            } catch (error) {
                this.showToast('Error deleting schedule entry', 'error');
            }
        }
    }

    filterTimetable() {
        this.loadTimetable();
    }

    resetTimetableFilters() {
        document.getElementById('filterDay').value = '';
        document.getElementById('filterSection').value = '';
        document.getElementById('filterSemester').value = '';
        this.loadTimetable();
    }



}

// Initialize the application
const app = new UniversityApp();         