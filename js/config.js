// Google Sheets Configuration for DLLE Committee Platform
const GOOGLE_SHEETS_CONFIG = {
    // You'll need to create a Google Apps Script project
    // and deploy it as a web app to get this URL
    scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
    
    // Google Sheets ID (you'll get this when you create the spreadsheet)
    spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
    
    // Google Drive Configuration
    drive: {
        mainFolderId: '10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf',
        profilePhotosFolderId: '10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf', // Will be updated when subfolders are created
        proofPhotosFolderId: '10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf', // Will be updated when subfolders are created
        eventPhotosFolderId: '10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf', // Will be updated when subfolders are created
        documentsFolderId: '10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf'   // Will be updated when subfolders are created
    },
    
    // Sheet names for different data
    sheets: {
        signupRequests: 'SignupRequests',
        students: 'Students',
        committeeAndStaff: 'CommitteeAndStaff',
        clockEntries: 'ClockEntries',
        activities: 'Activities',
        approvals: 'Approvals',
        photos: 'Photos'
    }
};

// Initialize Google Sheets API
window.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GOOGLE_SHEETS_CONFIG;
} 