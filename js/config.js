// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // You'll need to create a Google Apps Script project
    // and deploy it as a web app to get this URL
    scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
    
    // Google Sheets ID (you'll get this when you create the spreadsheet)
    spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
    
    // Sheet names for different data
    sheets: {
        users: 'Users',
        activities: 'Activities', 
        attendance: 'Attendance',
        signupRequests: 'SignupRequests'
    }
};

// Initialize Google Sheets API
window.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG; 