// Authentication Service
class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    loadUserFromStorage() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
        }
    }

    async login(email, password) {
        try {
            const response = await api.login(email, password);
            
            if (response.success) {
                api.setToken(response.token);
                this.currentUser = response.user;
                localStorage.setItem('user', JSON.stringify(response.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            this.showToast(error.message || 'Login failed', 'error');
            return false;
        }
    }

    logout() {
        api.setToken(null);
        this.currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    isAuthenticated() {
        return !!api.token;
    }

    getUser() {
        return this.currentUser;
    }

    getRole() {
        return this.currentUser ? this.currentUser.role : null;
    }

    async verifySession() {
        if (!this.isAuthenticated()) return false;
        
        try {
            await api.verifyToken();
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    showToast(message, type = 'success') {
        // Create toast notification
        const toastContainer = document.querySelector('.toast-container') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast show border-0 shadow-lg mb-2`;
        toast.style.borderLeft = `4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'}`;
        toast.style.background = 'white';
        toast.style.borderRadius = '12px';
        toast.innerHTML = `
            <div class="toast-body">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill text-success' : type === 'error' ? 'exclamation-triangle-fill text-danger' : 'info-circle-fill text-info'} me-2"></i>
                ${message}
            </div>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
        return container;
    }
}

const auth = new AuthService();