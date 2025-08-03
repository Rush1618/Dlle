// Dashboard Module
class DashboardManager {
    constructor() {
        this.currentTab = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Profile modal
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', () => this.showProfileModal());
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => authManager.logout());
        }

        // Back to login from signup
        const backToLoginBtn = document.getElementById('backToLogin');
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => authManager.showLoginPage());
        }

        // Show signup from login
        const showSignupBtn = document.getElementById('showSignup');
        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authManager.showSignupPage();
            });
        }
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(tabName);

        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
            this.currentTab = tabName;
            this.loadTabContent(tabName);
        }
    }

    async loadTabContent(tabName) {
        switch (tabName) {
            case 'manageUsers':
                await this.loadManageUsers();
                break;
            case 'studentList':
                await this.loadStudentList();
                break;
            case 'approvals':
                await this.loadApprovals();
                break;
            case 'activities':
                await this.loadActivities();
                break;
            case 'reports':
                await this.loadReports();
                break;
            case 'committeeStudentList':
                await this.loadCommitteeStudentList();
                break;
            case 'committeeApprovals':
                await this.loadCommitteeApprovals();
                break;
            case 'committeeActivities':
                await this.loadCommitteeActivities();
                break;
        }
    }

    async loadManageUsers() {
        // Load signup requests
        try {
            const requests = await dbManager.getSignupRequests();
            this.displaySignupRequests(requests);
        } catch (error) {
            console.error('Error loading signup requests:', error);
        }
    }

    async loadStudentList() {
        try {
            const students = await dbManager.getStudents();
            this.displayStudents(students);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    async loadApprovals() {
        try {
            const activities = await dbManager.getActivities();
            this.populateActivitySelect('approvalActivitySelect', activities);
        } catch (error) {
            console.error('Error loading approvals:', error);
        }
    }

    async loadActivities() {
        try {
            const activities = await dbManager.getActivities();
            this.displayActivities(activities);
        } catch (error) {
            console.error('Error loading activities:', error);
        }
    }

    async loadReports() {
        // Reports tab is mostly static, just setup export functionality
        this.setupExportFunctionality();
    }

    async loadCommitteeStudentList() {
        try {
            const students = await dbManager.getStudents();
            this.displayCommitteeStudents(students);
        } catch (error) {
            console.error('Error loading committee students:', error);
        }
    }

    async loadCommitteeApprovals() {
        try {
            const activities = await dbManager.getActivities();
            this.populateActivitySelect('committeeApprovalActivitySelect', activities);
        } catch (error) {
            console.error('Error loading committee approvals:', error);
        }
    }

    async loadCommitteeActivities() {
        try {
            const activities = await dbManager.getActivities();
            this.displayCommitteeActivities(activities);
        } catch (error) {
            console.error('Error loading committee activities:', error);
        }
    }

    displaySignupRequests(requests) {
        // Implementation for displaying signup requests
        console.log('Displaying signup requests:', requests);
    }

    displayStudents(students) {
        const tbody = document.getElementById('studentTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.class}</td>
                <td>${student.totalApprovedHours || 0}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="dashboardManager.viewStudent('${student.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    displayActivities(activities) {
        const tbody = document.getElementById('activityTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.name}</td>
                <td>${activity.description || 'N/A'}</td>
                <td>${activity.startDate ? activity.startDate.toDate().toLocaleDateString() : 'N/A'}</td>
                <td>${activity.endDate ? activity.endDate.toDate().toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="dashboardManager.editActivity('${activity.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="dashboardManager.deleteActivity('${activity.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    populateActivitySelect(selectId, activities) {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Select Activity</option>';
        activities.forEach(activity => {
            const option = document.createElement('option');
            option.value = activity.id;
            option.textContent = activity.name;
            select.appendChild(option);
        });

        // Add change event listener
        select.addEventListener('change', async (e) => {
            if (e.target.value) {
                await this.loadAttendanceForActivity(e.target.value, selectId);
            }
        });
    }

    async loadAttendanceForActivity(activityId, selectId) {
        try {
            const attendance = await dbManager.getAttendanceByActivity(activityId);
            const tableId = selectId === 'approvalActivitySelect' ? 'approvalTableBody' : 'committeeApprovalTableBody';
            this.displayAttendanceForApproval(attendance, tableId);
        } catch (error) {
            console.error('Error loading attendance for activity:', error);
        }
    }

    displayAttendanceForApproval(attendance, tableId) {
        const tbody = document.getElementById(tableId);
        if (!tbody) return;

        tbody.innerHTML = '';
        attendance.forEach(record => {
            const row = document.createElement('tr');
            const status = record.status || 'pending';
            const statusClass = status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning';
            
            row.innerHTML = `
                <td>${record.user.name}</td>
                <td>${record.clockInTime ? record.clockInTime.toDate().toLocaleString() : 'N/A'}</td>
                <td>${record.clockOutTime ? record.clockOutTime.toDate().toLocaleString() : 'N/A'}</td>
                <td>${record.duration ? `${record.duration.toFixed(2)} hours` : 'N/A'}</td>
                <td><span class="badge badge-${statusClass}">${status}</span></td>
                <td>
                    ${status === 'pending' ? `
                        <button class="btn btn-success btn-sm" onclick="dashboardManager.approveAttendance('${record.id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="dashboardManager.rejectAttendance('${record.id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    setupExportFunctionality() {
        const exportBtn = document.getElementById('exportExcelBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                const classFilter = document.getElementById('exportClass').value;
                await this.exportToExcel(classFilter);
            });
        }
    }

    async exportToExcel(classFilter) {
        try {
            const data = await dbManager.getExportData(classFilter);
            
            // Create CSV content
            const headers = Object.keys(data[0] || {});
            const csvContent = [
                headers.join(','),
                ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dlle-report-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            authManager.showMessage('Report exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            authManager.showMessage('Error exporting data. Please try again.', 'error');
        }
    }

    async approveAttendance(attendanceId) {
        try {
            await dbManager.approveAttendance(attendanceId);
            authManager.showMessage('Attendance approved successfully!', 'success');
            // Reload the current tab
            if (this.currentTab) {
                await this.loadTabContent(this.currentTab);
            }
        } catch (error) {
            console.error('Error approving attendance:', error);
            authManager.showMessage('Error approving attendance. Please try again.', 'error');
        }
    }

    async rejectAttendance(attendanceId) {
        try {
            await dbManager.rejectAttendance(attendanceId);
            authManager.showMessage('Attendance rejected successfully!', 'success');
            // Reload the current tab
            if (this.currentTab) {
                await this.loadTabContent(this.currentTab);
            }
        } catch (error) {
            console.error('Error rejecting attendance:', error);
            authManager.showMessage('Error rejecting attendance. Please try again.', 'error');
        }
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            const user = authManager.getCurrentUser();
            if (user) {
                document.getElementById('modalUserName').textContent = user.name || user.email;
                document.getElementById('modalUserRole').textContent = user.role || 'N/A';
                document.getElementById('modalUserClass').textContent = user.class || 'N/A';
                document.getElementById('modalUserHours').textContent = `Total Approved Hours: ${user.totalApprovedHours || 0}`;
                
                if (user.photoURL) {
                    document.getElementById('modalProfileImg').src = user.photoURL;
                }
            }
            modal.classList.add('active');
        }
    }

    viewStudent(studentId) {
        // Implementation for viewing student details
        console.log('Viewing student:', studentId);
    }

    editActivity(activityId) {
        // Implementation for editing activity
        console.log('Editing activity:', activityId);
    }

    async deleteActivity(activityId) {
        if (confirm('Are you sure you want to delete this activity?')) {
            try {
                await dbManager.deleteActivity(activityId);
                authManager.showMessage('Activity deleted successfully!', 'success');
                await this.loadActivities();
            } catch (error) {
                console.error('Error deleting activity:', error);
                authManager.showMessage('Error deleting activity. Please try again.', 'error');
            }
        }
    }
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();
window.dashboardManager = dashboardManager; 