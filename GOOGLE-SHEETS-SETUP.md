# Google Sheets Setup for DLLE Committee Platform

## 🎯 **Complete Setup Guide - No Firebase Required!**

Your DLLE Committee Platform will now use Google Sheets as the database - completely free and simple!

## 📋 **Step 1: Create Google Spreadsheet**

### 1.1 Create New Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** to create a new spreadsheet
3. Name it: **"DLLE Committee Platform"**

### 1.2 Get Spreadsheet ID
1. Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`
2. Copy the **spreadsheet ID** (the long string between `/d/` and `/edit`)
3. Save this ID - you'll need it later

## 🔧 **Step 2: Set Up Google Apps Script**

### 2.1 Create Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New project"**
3. Name it: **"DLLE Backend"**

### 2.2 Add the Backend Code
1. Delete the default code in the editor
2. Copy and paste the entire code from `google-apps-script.gs`
3. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
4. Click **"Save"** (Ctrl+S)

### 2.3 Deploy as Web App
1. Click **"Deploy"** > **"New deployment"**
2. Click **"Select type"** > **"Web app"**
3. Set these options:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **"Deploy"**
5. Click **"Authorize access"** and follow the prompts
6. Copy the **Web app URL** - this is your backend API

## ⚙️ **Step 3: Update Your Web App**

### 3.1 Update Configuration
1. Open `js/config.js`
2. Replace the placeholder values:
```javascript
const GOOGLE_SHEETS_CONFIG = {
    scriptUrl: 'YOUR_WEB_APP_URL_HERE', // Paste the URL from step 2.3
    spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE', // Paste your spreadsheet ID
    
    sheets: {
        users: 'Users',
        activities: 'Activities', 
        attendance: 'Attendance',
        signupRequests: 'SignupRequests'
    }
};
```

## 👤 **Step 4: Create First Staff Account**

### 4.1 Add Staff User
1. Open your Google Spreadsheet
2. The sheets will be created automatically when you first use the app
3. Or manually create these sheets:
   - **Users** (for all user accounts)
   - **Activities** (for DLLE activities)
   - **Attendance** (for clock in/out records)
   - **SignupRequests** (for pending registrations)

### 4.2 Add Admin User (Optional Manual Method)
1. Go to the **Users** sheet
2. Add this row manually:
```
id | name | email | username | password | role | class | totalApprovedHours | status | createdAt
[generate UUID] | Admin User | admin@dlle.com | admin | admin123456 | staff | | 0 | approved | [current date]
```

## 🚀 **Step 5: Deploy Your Web App**

### 5.1 GitHub Pages (Recommended)
1. Create GitHub repository
2. Upload all your files
3. Enable GitHub Pages
4. Your app will be live!

### 5.2 Test Your Setup
1. Open your deployed web app
2. Login with:
   - Email: `admin@dlle.com`
   - Password: `admin123456`
3. Test all features

## 📊 **How Google Sheets Works as Database**

### **Data Structure:**
```
Users Sheet:
- id, name, email, username, password, role, class, totalApprovedHours, status, createdAt

Activities Sheet:
- id, name, description, startDate, endDate, createdAt

Attendance Sheet:
- id, userId, activityId, clockInTime, clockOutTime, duration, status, createdAt

SignupRequests Sheet:
- id, name, email, username, password, class, role, status, createdAt
```

### **Benefits:**
✅ **Completely Free** - No Firebase costs  
✅ **Simple Setup** - Just Google Sheets  
✅ **Easy to View** - Data in spreadsheet format  
✅ **No Limits** - Google Sheets handles everything  
✅ **Backup** - Automatic Google backup  
✅ **Collaboration** - Multiple people can view data  

## 🔒 **Security Features**

### **Authentication:**
- Simple email/password system
- Session-based login
- Role-based access control

### **Data Protection:**
- All data stored in your Google account
- Only you control access
- No third-party database

## 📱 **Features That Work**

✅ **User Management** - Add, edit, delete users  
✅ **Activity Management** - Create and manage activities  
✅ **Time Tracking** - Clock in/out functionality  
✅ **Approval System** - Approve/reject attendance  
✅ **Reporting** - Export data to Excel  
✅ **Search** - Find users quickly  
✅ **Role-based Access** - Different dashboards for different roles  

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"Script URL not found"**
   - Check that you deployed the Apps Script correctly
   - Make sure the URL is copied correctly

2. **"Spreadsheet not found"**
   - Verify your spreadsheet ID is correct
   - Make sure the spreadsheet is shared with your Google account

3. **"Permission denied"**
   - Check Apps Script deployment settings
   - Make sure "Who has access" is set to "Anyone"

4. **"Function not found"**
   - Check that all code was copied correctly
   - Make sure the Apps Script is saved and deployed

### **Debug Steps:**
1. Open browser console (F12)
2. Check for error messages
3. Verify all URLs are correct
4. Test Apps Script directly in the editor

## 🎯 **Next Steps After Setup**

1. **Create Activities** - Add your DLLE activities
2. **Add Committee Members** - Create accounts for committee
3. **Test Student Signup** - Verify the approval process
4. **Train Users** - Show everyone how to use the system
5. **Monitor Usage** - Check the spreadsheet regularly

## 💡 **Pro Tips**

### **Data Management:**
- Regularly backup your spreadsheet
- Use filters to view specific data
- Create additional sheets for custom reports

### **User Experience:**
- The app works exactly like before
- All features remain the same
- No user training needed

### **Maintenance:**
- Check Apps Script quotas occasionally
- Monitor spreadsheet size
- Update user passwords regularly

## 🎉 **You're Done!**

Your DLLE Committee Platform is now:
- ✅ **Completely free** (no Firebase costs)
- ✅ **Simple to manage** (Google Sheets interface)
- ✅ **Easy to backup** (automatic Google backup)
- ✅ **Professional** (same features as before)
- ✅ **Long-term** (no expiration or limits)

**Start using your platform today!** 🚀

---

**Need help?** Check the troubleshooting section or contact support. 