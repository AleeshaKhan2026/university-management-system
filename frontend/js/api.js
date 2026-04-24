// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://your-backend-url.onrender.com/api';

// API Service Class
class APIService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: this.getHeaders(),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async verifyToken() {
        return this.request('/auth/verify');
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // Student endpoints
    async getStudents() {
        return this.request('/students');
    }

    async getStudent(id) {
        return this.request(`/students/${id}`);
    }

    async createStudent(studentData) {
        return this.request('/students', {
            method: 'POST',
            body: JSON.stringify(studentData)
        });
    }

    async updateStudent(id, studentData) {
        return this.request(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(studentData)
        });
    }

    async deleteStudent(id) {
        return this.request(`/students/${id}`, {
            method: 'DELETE'
        });
    }

    // Teacher endpoints
    async getTeachers() {
        return this.request('/teachers');
    }

    async getTeacher(id) {
        return this.request(`/teachers/${id}`);
    }

    async createTeacher(teacherData) {
        return this.request('/teachers', {
            method: 'POST',
            body: JSON.stringify(teacherData)
        });
    }

    async updateTeacher(id, teacherData) {
        return this.request(`/teachers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(teacherData)
        });
    }

    async deleteTeacher(id) {
        return this.request(`/teachers/${id}`, {
            method: 'DELETE'
        });
    }

    // Course endpoints
    async getCourses() {
        return this.request('/courses');
    }

    async getCourse(id) {
        return this.request(`/courses/${id}`);
    }

    async createCourse(courseData) {
        return this.request('/courses', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    }

    async updateCourse(id, courseData) {
        return this.request(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(courseData)
        });
    }

    async deleteCourse(id) {
        return this.request(`/courses/${id}`, {
            method: 'DELETE'
        });
    }

    // Enrollment endpoints
    async getEnrollments(studentId = null, courseId = null) {
        let query = [];
        if (studentId) query.push(`studentId=${studentId}`);
        if (courseId) query.push(`courseId=${courseId}`);
        const queryString = query.length ? `?${query.join('&')}` : '';
        return this.request(`/enrollments${queryString}`);
    }

    async getEnrollment(id) {
        return this.request(`/enrollments/${id}`);
    }

    async createEnrollment(enrollmentData) {
        return this.request('/enrollments', {
            method: 'POST',
            body: JSON.stringify(enrollmentData)
        });
    }

    async updateEnrollment(id, enrollmentData) {
        return this.request(`/enrollments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(enrollmentData)
        });
    }

    async deleteEnrollment(id) {
        return this.request(`/enrollments/${id}`, {
            method: 'DELETE'
        });
    }

    // Attendance endpoints
    async getAttendance(studentId = null, courseId = null, date = null) {
        let query = [];
        if (studentId) query.push(`studentId=${studentId}`);
        if (courseId) query.push(`courseId=${courseId}`);
        if (date) query.push(`date=${date}`);
        const queryString = query.length ? `?${query.join('&')}` : '';
        return this.request(`/attendance${queryString}`);
    }

    async markAttendance(attendanceData) {
        return this.request('/attendance', {
            method: 'POST',
            body: JSON.stringify(attendanceData)
        });
    }

    async markBatchAttendance(records) {
        return this.request('/attendance/batch', {
            method: 'POST',
            body: JSON.stringify({ records })
        });
    }

    async updateAttendance(id, status) {
        return this.request(`/attendance/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async deleteAttendance(id) {
        return this.request(`/attendance/${id}`, {
            method: 'DELETE'
        });
    }

    // Fee endpoints
    async getFees(studentId = null, status = null) {
        let query = [];
        if (studentId) query.push(`studentId=${studentId}`);
        if (status) query.push(`status=${status}`);
        const queryString = query.length ? `?${query.join('&')}` : '';
        return this.request(`/fees${queryString}`);
    }

    async getFee(id) {
        return this.request(`/fees/${id}`);
    }

    async createFeeRecord(feeData) {
        return this.request('/fees', {
            method: 'POST',
            body: JSON.stringify(feeData)
        });
    }

    async updateFeeRecord(id, feeData) {
        return this.request(`/fees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(feeData)
        });
    }

    async payFee(id) {
        return this.request(`/fees/${id}/pay`, {
            method: 'PUT'
        });
    }

    async deleteFeeRecord(id) {
        return this.request(`/fees/${id}`, {
            method: 'DELETE'
        });
    }

    // Department endpoints
    async getDepartments() {
        return this.request('/departments');
    }

    async getDepartment(id) {
        return this.request(`/departments/${id}`);
    }

    async createDepartment(deptData) {
        return this.request('/departments', {
            method: 'POST',
            body: JSON.stringify(deptData)
        });
    }

    async updateDepartment(id, deptData) {
        return this.request(`/departments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(deptData)
        });
    }

    async deleteDepartment(id) {
        return this.request(`/departments/${id}`, {
            method: 'DELETE'
        });
    }

// Add this method to the APIService class in api.js
async saveAttendance(date, courseId, records) {
    return this.request('/attendance/save', {
        method: 'POST',
        body: JSON.stringify({ date, courseId, records })
    });
}

async getAttendanceSummary() {
    return this.request('/attendance/summary');
}

async saveAttendance(date, courseId, records) {
    return this.request('/attendance/save', {
        method: 'POST',
        body: JSON.stringify({ date, courseId, records })
    });
}

// Timetable endpoints
async getTimetable(day = null, section = null, semester = null) {
    let query = [];
    if (day) query.push(`day=${day}`);
    if (section) query.push(`section=${section}`);
    if (semester) query.push(`semester=${semester}`);
    const queryString = query.length ? `?${query.join('&')}` : '';
    return this.request(`/timetable${queryString}`);
}

async getTimetableEntry(id) {
    return this.request(`/timetable/${id}`);
}

async createTimetableEntry(entryData) {
    return this.request('/timetable', {
        method: 'POST',
        body: JSON.stringify(entryData)
    });
}

async updateTimetableEntry(id, entryData) {
    return this.request(`/timetable/${id}`, {
        method: 'PUT',
        body: JSON.stringify(entryData)
    });
}

async deleteTimetableEntry(id) {
    return this.request(`/timetable/${id}`, {
        method: 'DELETE'
    });
}

async getDays() {
    return this.request('/timetable/days/list');
}


}

// Initialize API service
const api = new APIService();