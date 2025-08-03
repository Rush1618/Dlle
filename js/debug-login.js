// Debug Login Script
// This script helps debug login redirection issues

class LoginDebugger {
    constructor() {
        this.debugMode = true;
    }

    // Debug login process
    async debugLogin(email, password) {
        console.log('🔍 Starting login debug...');
        console.log('Email:', email);
        console.log('Password:', password);

        try {
            // Test connection first
            console.log('1. Testing connection...');
            const connectionTest = await sheetsManager.testConnection();
            console.log('Connection test result:', connectionTest);

            if (!connectionTest.success) {
                console.error('❌ Connection failed:', connectionTest.error);
                return false;
            }

            // Test user lookup
            console.log('2. Testing user lookup...');
            const user = await sheetsManager.getUserByEmail(email);
            console.log('User lookup result:', user);

            if (!user) {
                console.error('❌ User not found');
                return false;
            }

            // Test password
            console.log('3. Testing password...');
            if (user.password !== password) {
                console.error('❌ Password mismatch');
                return false;
            }

            console.log('✅ Password correct');

            // Test dashboard elements
            console.log('4. Testing dashboard elements...');
            this.testDashboardElements(user.role);

            // Test redirection
            console.log('5. Testing redirection...');
            this.testRedirection(user.role);

            return true;
        } catch (error) {
            console.error('❌ Debug error:', error);
            return false;
        }
    }

    // Test if dashboard elements exist
    testDashboardElements(role) {
        console.log('Testing dashboard elements for role:', role);

        const elements = {
            loginPage: document.getElementById('loginPage'),
            signupPage: document.getElementById('signupPage'),
            dashboardPage: document.getElementById('dashboardPage'),
            staffDashboard: document.getElementById('staffDashboard'),
            committeeDashboard: document.getElementById('committeeDashboard'),
            studentDashboard: document.getElementById('studentDashboard'),
            userName: document.getElementById('userName'),
            userProfileImg: document.getElementById('userProfileImg')
        };

        console.log('Element check results:');
        Object.entries(elements).forEach(([name, element]) => {
            console.log(`  ${name}: ${element ? '✅ Found' : '❌ Missing'}`);
        });

        // Check specific dashboard for role
        let targetDashboard;
        if (role === 'staff' || role === 'admin') {
            targetDashboard = elements.staffDashboard;
        } else if (role === 'committee') {
            targetDashboard = elements.committeeDashboard;
        } else {
            targetDashboard = elements.studentDashboard;
        }

        console.log(`Target dashboard for role '${role}': ${targetDashboard ? '✅ Found' : '❌ Missing'}`);
    }

    // Test redirection logic
    testRedirection(role) {
        console.log('Testing redirection logic...');

        // Simulate the redirection
        const loginPage = document.getElementById('loginPage');
        const signupPage = document.getElementById('signupPage');
        const dashboardPage = document.getElementById('dashboardPage');

        if (!loginPage || !signupPage || !dashboardPage) {
            console.error('❌ Required page elements missing');
            return;
        }

        console.log('1. Hiding login page...');
        loginPage.classList.remove('active');
        console.log('Login page active class removed');

        console.log('2. Hiding signup page...');
        signupPage.classList.remove('active');
        console.log('Signup page active class removed');

        console.log('3. Showing dashboard page...');
        dashboardPage.classList.add('active');
        console.log('Dashboard page active class added');

        // Hide all dashboards
        const staffDashboard = document.getElementById('staffDashboard');
        const committeeDashboard = document.getElementById('committeeDashboard');
        const studentDashboard = document.getElementById('studentDashboard');

        if (staffDashboard) {
            staffDashboard.style.display = 'none';
            console.log('Staff dashboard hidden');
        }

        if (committeeDashboard) {
            committeeDashboard.style.display = 'none';
            console.log('Committee dashboard hidden');
        }

        if (studentDashboard) {
            studentDashboard.style.display = 'none';
            console.log('Student dashboard hidden');
        }

        // Show appropriate dashboard
        let targetDashboard;
        if (role === 'staff' || role === 'admin') {
            targetDashboard = staffDashboard;
            console.log('Showing staff dashboard');
        } else if (role === 'committee') {
            targetDashboard = committeeDashboard;
            console.log('Showing committee dashboard');
        } else {
            targetDashboard = studentDashboard;
            console.log('Showing student dashboard');
        }

        if (targetDashboard) {
            targetDashboard.style.display = 'block';
            console.log('✅ Target dashboard displayed');
        } else {
            console.error('❌ Target dashboard not found');
        }
    }

    // Force show dashboard (for testing)
    forceShowDashboard(role) {
        console.log('🔄 Force showing dashboard for role:', role);
        
        // Hide all pages
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('signupPage').classList.remove('active');
        document.getElementById('dashboardPage').classList.add('active');

        // Hide all dashboards
        document.getElementById('staffDashboard').style.display = 'none';
        document.getElementById('committeeDashboard').style.display = 'none';
        document.getElementById('studentDashboard').style.display = 'none';

        // Show appropriate dashboard
        if (role === 'staff' || role === 'admin') {
            document.getElementById('staffDashboard').style.display = 'block';
        } else if (role === 'committee') {
            document.getElementById('committeeDashboard').style.display = 'block';
        } else {
            document.getElementById('studentDashboard').style.display = 'block';
        }

        console.log('✅ Dashboard forced to show');
    }

    // Test user data
    testUserData(user) {
        console.log('Testing user data:', user);
        
        // Check required fields
        const requiredFields = ['id', 'name', 'email', 'role'];
        requiredFields.forEach(field => {
            if (!user[field]) {
                console.error(`❌ Missing required field: ${field}`);
            } else {
                console.log(`✅ Field ${field}: ${user[field]}`);
            }
        });

        // Test localStorage
        try {
            localStorage.setItem('dlle_user', JSON.stringify(user));
            const savedUser = JSON.parse(localStorage.getItem('dlle_user'));
            console.log('✅ User saved to localStorage:', savedUser);
        } catch (error) {
            console.error('❌ localStorage error:', error);
        }
    }
}

// Make debugger available globally
window.LoginDebugger = LoginDebugger;

// Auto-run debug if URL contains debug=true
if (window.location.search.includes('debug=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.loginDebugger = new LoginDebugger();
        console.log('🔧 Login debugger initialized');
        
        // Add debug button to login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const debugBtn = document.createElement('button');
            debugBtn.type = 'button';
            debugBtn.textContent = 'Debug Login';
            debugBtn.className = 'btn btn-warning';
            debugBtn.onclick = async () => {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                await window.loginDebugger.debugLogin(email, password);
            };
            loginForm.appendChild(debugBtn);
        }
    });
} 