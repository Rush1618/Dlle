// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // You'll need to create a Google Apps Script project
    // and deploy it as a web app to get this URL
    scriptUrl: 'https://script.google.com/macros/s/AKfycbxFaQJv9-FpCnMX_o6AT37TsUSD8WDRFzWpgGhDmDs_884jP-gy6OO2g2YbBGUDgqm_WA/exec',
    
    // Google Sheets ID (you'll get this when you create the spreadsheet)
    spreadsheetId: '1hiTeBU7GeVfVAO1gQHFDiGkZouyEaizj1nnIGd-as2E',
    
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