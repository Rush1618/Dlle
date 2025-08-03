// Main Application File
class DLLEApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        this.setupFormListeners();
        this.setupStudentDashboard();
        this.setupModals();
    }

    setupFormListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                await authManager.login(email, password);
            });
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSignup();
            });
        }

        // Add user form (staff)
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAddUser();
            });
        }

        // Add activity form
        const addActivityForm = document.getElementById('addActivityForm');
        if (addActivityForm) {
            addActivityForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAddActivity();
            });
        }
    }

    async handleSignup() {
        const formData = {
            name: document.getElementById('signupName').value,
            email: document.getElementById('signupEmail').value,
            username: document.getElementById('signupUsername').value,
            password: document.getElementById('signupPassword').value,
            class: document.getElementById('signupClass').value,
            role: document.getElementById('signupRole').value,
            photoFile: document.getElementById('signupPhoto').files[0] || null
        };

        await authManager.signup(formData);
    }

    async handleAddUser() {
        const formData = {
            name: document.getElementById('addUserName').value,
            email: document.getElementById('addUserEmail').value,
            username: document.getElementById('addUserUsername').value,
            password: document.getElementById('addUserPassword').value,
            role: document.getElementById('addUserRole').value,
            class: document.getElementById('addUserClass').value,
            photoFile: document.getElementById('addUserPhoto').files[0] || null,
            existingHours: parseFloat(document.getElementById('addUserHours').value) || 0
        };

        const success = await authManager.addUser(formData);
        if (success) {
            document.getElementById('addUserForm').reset();
        }
    }

    async handleAddActivity() {
        const formData = {
            name: document.getElementById('activityName').value,
            description: document.getElementById('activityDescription').value,
            startDate: document.getElementById('activityStartDate').value,
            endDate: document.getElementById('activityEndDate').value
        };

        try {
            await dbManager.addActivity(formData);
            authManager.showMessage('Activity added successfully!', 'success');
            document.getElementById('addActivityForm').reset();
            this.closeModal('addActivityModal');
            await dashboardManager.loadActivities();
        } catch (error) {
            console.error('Error adding activity:', error);
            authManager.showMessage('Error adding activity. Please try again.', 'error');
        }
    }

    setupStudentDashboard() {
        // Clock in/out functionality
        const clockInBtn = document.getElementById('clockInBtn');
        const clockOutBtn = document.getElementById('clockOutBtn');
        const activitySelect = document.getElementById('studentActivitySelect');

        if (clockInBtn) {
            clockInBtn.addEventListener('click', async () => {
                await this.handleClockIn();
            });
        }

        if (clockOutBtn) {
            clockOutBtn.addEventListener('click', async () => {
                await this.handleClockOut();
            });
        }

        if (activitySelect) {
            activitySelect.addEventListener('change', () => {
                this.updateClockButtons();
            });
        }

        // Load student dashboard data
        this.loadStudentDashboard();
    }

    async handleClockIn() {
        const activityId = document.getElementById('studentActivitySelect').value;
        if (!activityId) {
            authManager.showMessage('Please select an activity first.', 'warning');
            return;
        }

        try {
            const userId = authManager.getCurrentUser().uid;
            const attendanceId = await dbManager.clockIn(userId, activityId);
            
            // Store attendance ID for clock out
            localStorage.setItem('currentAttendanceId', attendanceId);
            
            authManager.showMessage('Clocked in successfully!', 'success');
            this.updateClockButtons();
            this.showCurrentSession();
            await this.loadStudentActivityLog();
        } catch (error) {
            console.error('Error clocking in:', error);
            authManager.showMessage('Error clocking in. Please try again.', 'error');
        }
    }

    async handleClockOut() {
        const attendanceId = localStorage.getItem('currentAttendanceId');
        if (!attendanceId) {
            authManager.showMessage('No active session found.', 'warning');
            return;
        }

        try {
            await dbManager.clockOut(attendanceId);
            
            // Clear stored attendance ID
            localStorage.removeItem('currentAttendanceId');
            
            authManager.showMessage('Clocked out successfully!', 'success');
            this.updateClockButtons();
            this.hideCurrentSession();
            await this.loadStudentActivityLog();
        } catch (error) {
            console.error('Error clocking out:', error);
            authManager.showMessage('Error clocking out. Please try again.', 'error');
        }
    }

    updateClockButtons() {
        const activityId = document.getElementById('studentActivitySelect').value;
        const clockInBtn = document.getElementById('clockInBtn');
        const clockOutBtn = document.getElementById('clockOutBtn');

        if (activityId) {
            clockInBtn.disabled = false;
            // Check if user is already clocked in
            this.checkClockInStatus();
        } else {
            clockInBtn.disabled = true;
            clockOutBtn.disabled = true;
        }
    }

    async checkClockInStatus() {
        try {
            const userId = authManager.getCurrentUser().uid;
            const status = await dbManager.isUserClockedIn(userId);
            
            const clockInBtn = document.getElementById('clockInBtn');
            const clockOutBtn = document.getElementById('clockOutBtn');

            if (status.isClockedIn) {
                clockInBtn.disabled = true;
                clockOutBtn.disabled = false;
                this.showCurrentSession();
            } else {
                clockInBtn.disabled = false;
                clockOutBtn.disabled = true;
                this.hideCurrentSession();
            }
        } catch (error) {
            console.error('Error checking clock in status:', error);
        }
    }

    showCurrentSession() {
        const currentSession = document.getElementById('currentSession');
        if (currentSession) {
            currentSession.style.display = 'block';
        }
    }

    hideCurrentSession() {
        const currentSession = document.getElementById('currentSession');
        if (currentSession) {
            currentSession.style.display = 'none';
        }
    }

    async loadStudentDashboard() {
        try {
            // Load current activities for dropdown
            const activities = await dbManager.getCurrentActivities();
            this.populateStudentActivitySelect(activities);

            // Load student activity log
            await this.loadStudentActivityLog();

            // Update stats
            this.updateStudentStats();

            // Check clock in status
            await this.checkClockInStatus();
        } catch (error) {
            console.error('Error loading student dashboard:', error);
        }
    }

    populateStudentActivitySelect(activities) {
        const select = document.getElementById('studentActivitySelect');
        if (!select) return;

        select.innerHTML = '<option value="">Choose an activity...</option>';
        activities.forEach(activity => {
            const option = document.createElement('option');
            option.value = activity.id;
            option.textContent = activity.name;
            select.appendChild(option);
        });
    }

    async loadStudentActivityLog() {
        try {
            const userId = authManager.getCurrentUser().uid;
            const attendance = await dbManager.getUserAttendance(userId);
            this.displayStudentActivityLog(attendance);
        } catch (error) {
            console.error('Error loading student activity log:', error);
        }
    }

    displayStudentActivityLog(attendance) {
        const tbody = document.getElementById('studentActivityTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        attendance.forEach(record => {
            const row = document.createElement('tr');
            const status = record.status || 'pending';
            const statusClass = status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning';
            
            row.innerHTML = `
                <td>${record.clockInTime ? record.clockInTime.toDate().toLocaleDateString() : 'N/A'}</td>
                <td>${record.activity ? record.activity.name : 'N/A'}</td>
                <td>${record.clockInTime ? record.clockInTime.toDate().toLocaleTimeString() : 'N/A'}</td>
                <td>${record.clockOutTime ? record.clockOutTime.toDate().toLocaleTimeString() : 'N/A'}</td>
                <td>${record.duration ? `${record.duration.toFixed(2)} hours` : 'N/A'}</td>
                <td><span class="badge badge-${statusClass}">${status}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    updateStudentStats() {
        const user = authManager.getCurrentUser();
        if (user) {
            const totalHoursElement = document.getElementById('totalApprovedHours');
            const totalActivitiesElement = document.getElementById('totalActivities');

            if (totalHoursElement) {
                totalHoursElement.textContent = user.totalApprovedHours || 0;
            }

            if (totalActivitiesElement) {
                // This would need to be calculated from attendance records
                totalActivitiesElement.textContent = '0'; // Placeholder
            }
        }
    }

    setupModals() {
        // Close modal buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') || e.target.closest('.close-btn')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Add activity modal
        const addActivityBtn = document.getElementById('addActivityBtn');
        if (addActivityBtn) {
            addActivityBtn.addEventListener('click', () => {
                this.openModal('addActivityModal');
            });
        }

        // Close profile modal
        const closeProfileModal = document.getElementById('closeProfileModal');
        if (closeProfileModal) {
            closeProfileModal.addEventListener('click', () => {
                this.closeModal('profileModal');
            });
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dlleApp = new DLLEApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .badge-success {
        background: #d4edda;
        color: #155724;
    }

    .badge-danger {
        background: #f8d7da;
        color: #721c24;
    }

    .badge-warning {
        background: #fff3cd;
        color: #856404;
    }

    .btn-sm {
        padding: 6px 12px;
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style); 