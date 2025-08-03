# 🚀 DLLE Google Apps Script Backend Setup Guide

## 📋 Overview

This Google Apps Script serves as the complete backend for your DLLE (Digital Learning & Leadership Experience) Committee Platform. It handles all database operations, authentication, file uploads, and API requests.

## 🔧 Setup Instructions

### Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **"New Project"**
3. Rename the project to **"DLLE Backend"**
4. Delete the default `Code.gs` content
5. Copy and paste the entire content from `google-apps-script.gs` into the editor

### Step 2: Configure Your Google Sheets

1. **Create a new Google Spreadsheet** or use an existing one
2. **Copy the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```
3. **Update the CONFIG object** in the script:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
     DRIVE_FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID_HERE',
     // ... rest of config
   };
   ```

### Step 3: Set Up Google Drive Folder

1. **Create a new folder** in Google Drive for storing photos
2. **Copy the Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/YOUR_FOLDER_ID
   ```
3. **Update the DRIVE_FOLDER_ID** in the CONFIG object

### Step 4: Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Choose **"Web app"** as the type
3. Set **"Execute as"** to **"Me"**
4. Set **"Who has access"** to **"Anyone"**
5. Click **"Deploy"**
6. **Copy the Web App URL** - you'll need this for your frontend

### Step 5: Initialize Your Sheets

1. In the Apps Script editor, run the `initializeSheets()` function
2. This will create all necessary sheets with proper headers
3. Check your Google Spreadsheet to confirm the sheets were created

## 📊 Database Structure

The script creates and manages these sheets:

### 1. **SignupRequests**
- Stores pending user registration requests
- **Headers**: `id, name, email, username, password, class, role, committeeRole, studentManager, profilePhotoUrl, status, createdAt`

### 2. **Students**
- Stores approved student accounts
- **Headers**: `id, name, email, username, password, class, role, committeeRole, studentManager, profilePhotoUrl, totalApprovedHours, status, createdAt`

### 3. **CommitteeAndStaff**
- Stores committee members and staff accounts
- **Headers**: Same as Students sheet

### 4. **ClockEntries**
- Stores all clock in/out records
- **Headers**: `id, userId, name, email, activity, activityId, clockIn, clockOut, duration, status, approvedBy, imageUrl, date, role`

### 5. **Activities**
- Stores available activities/events
- **Headers**: `id, name, date, description, createdAt`

### 6. **Approvals**
- Logs all approval/rejection actions
- **Headers**: `id, entryId, approvedBy, approvedAt, status, comments`

### 7. **Photos**
- Stores photo metadata and URLs
- **Headers**: `id, name, email, role, activity, imageUrl, type, timestamp`

## 🔌 API Endpoints

The script handles these actions via POST requests:

### Authentication
- `login` - User authentication
- `signup` - User registration

### User Management
- `getUsers` - Get all users
- `getStudents` - Get only students
- `addUser` - Create new user
- `updateUser` - Update user data
- `deleteUser` - Delete user
- `getUserByEmail` - Find user by email
- `getUserById` - Find user by ID

### Activity Management
- `getActivities` - Get all activities
- `addActivity` - Create new activity
- `updateActivity` - Update activity
- `deleteActivity` - Delete activity

### Clock In/Out
- `clockIn` - Clock in to activity
- `clockOut` - Clock out from activity
- `getClockEntries` - Get all clock entries
- `getUserAttendance` - Get user's attendance
- `approveAttendance` - Approve attendance
- `rejectAttendance` - Reject attendance
- `isUserClockedIn` - Check if user is clocked in

### Signup Requests
- `getSignupRequests` - Get pending requests
- `approveSignupRequest` - Approve signup
- `rejectSignupRequest` - Reject signup

### File Management
- `uploadPhoto` - Upload photo to Google Drive

### Utilities
- `getExportData` - Export student data
- `searchUsers` - Search users
- `testConnection` - Test API connection

## 📝 Request Format

All requests should be POST requests with JSON body:

```javascript
{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}
```

## 📤 Response Format

All responses follow this format:

```javascript
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

Or for errors:

```javascript
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message"
}
```

## 🔐 Security Features

- **CORS Support** - Configured for GitHub Pages
- **Input Validation** - All inputs are validated
- **Error Handling** - Comprehensive error messages
- **Role-based Access** - Different permissions for different roles

## 🚨 Important Notes

### 1. **Deployment Settings**
- Always set access to **"Anyone"** for GitHub Pages compatibility
- Execute as **"Me"** to ensure proper permissions

### 2. **Google Drive Permissions**
- The script needs permission to access Google Drive
- Photos are stored with **"Anyone with link can view"** permissions

### 3. **Rate Limits**
- Google Apps Script has daily execution quotas
- Monitor usage in the Apps Script dashboard

### 4. **Data Backup**
- Regularly backup your Google Sheets data
- Consider setting up automated backups

## 🛠️ Troubleshooting

### Common Issues:

1. **"Spreadsheet not found"**
   - Check your Spreadsheet ID is correct
   - Ensure the script has permission to access the spreadsheet

2. **"Folder not found"**
   - Verify your Drive Folder ID is correct
   - Ensure the script has permission to access Google Drive

3. **CORS Errors**
   - Make sure deployment is set to **"Anyone"**
   - Check that the Web App URL is correct in your frontend

4. **"Function not found"**
   - Ensure all functions are properly copied
   - Check for syntax errors in the script

### Testing the Connection:

Use the `testConnection` action to verify your setup:

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'testConnection' })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 📞 Support

If you encounter issues:

1. Check the **Apps Script execution logs**
2. Verify all **configuration values** are correct
3. Test with the **testConnection** endpoint
4. Ensure **Google Sheets permissions** are set correctly

## 🔄 Updates

To update the script:

1. **Backup your current script**
2. **Replace the content** with the new version
3. **Create a new deployment** or update existing one
4. **Test all functionality** before going live

---

**🎯 Your DLLE Google Apps Script backend is now ready to power your committee platform!** 