// Test Connection Script for DLLE Platform
// This script helps debug connection issues with Google Apps Script

class ConnectionTester {
    constructor() {
        this.config = GOOGLE_SHEETS_CONFIG;
        this.scriptUrl = this.config.scriptUrl;
    }

    // Test basic connection to Google Apps Script
    async testConnection() {
        console.log('🔍 Testing connection to Google Apps Script...');
        console.log('Script URL:', this.scriptUrl);
        
        try {
            const response = await fetch(this.scriptUrl, {
                method: 'GET'
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Connection successful!');
                console.log('Response:', result);
                return true;
            } else {
                console.error('❌ Connection failed!');
                console.error('Status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Connection error:', error);
            return false;
        }
    }

    // Test login functionality
    async testLogin(email, password) {
        console.log('🔍 Testing login functionality...');
        console.log('Email:', email);
        
        try {
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email: email,
                    password: password
                })
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Login response received!');
                console.log('Response:', result);
                return result;
            } else {
                console.error('❌ Login request failed!');
                console.error('Status:', response.status);
                return null;
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            return null;
        }
    }

    // Test Google Sheets access
    async testSheetsAccess() {
        console.log('🔍 Testing Google Sheets access...');
        console.log('Spreadsheet ID:', this.config.spreadsheetId);
        
        try {
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'getUsers'
                })
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Sheets access successful!');
                console.log('Response:', result);
                return true;
            } else {
                console.error('❌ Sheets access failed!');
                console.error('Status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Sheets access error:', error);
            return false;
        }
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Starting DLLE Platform Connection Tests...');
        console.log('==========================================');
        
        // Test 1: Basic connection
        const connectionOk = await this.testConnection();
        
        if (connectionOk) {
            // Test 2: Sheets access
            await this.testSheetsAccess();
            
            // Test 3: Login with test credentials
            await this.testLogin('test@example.com', 'password123');
        }
        
        console.log('==========================================');
        console.log('🏁 Tests completed!');
    }
}

// Make tester available globally
window.ConnectionTester = ConnectionTester;

// Auto-run tests when page loads (for debugging)
if (window.location.search.includes('debug=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        const tester = new ConnectionTester();
        tester.runAllTests();
    });
} 