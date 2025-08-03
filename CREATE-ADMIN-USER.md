# 👑 Create Admin User Guide

## 🎯 **Quick Setup: Create Your First Admin User**

Since your login is failing, you likely need to create your first admin user in the Google Sheets database.

## 📋 **Method 1: Direct Google Sheets Entry**

### **Step 1: Open Your Google Sheets**
1. Go to [Google Sheets](https://sheets.google.com)
2. Open your spreadsheet: `1hiTeBU7GeVfVAO1gQHFDiGkZouyEaizj1nnIGd-as2E`

### **Step 2: Create CommitteeAndStaff Sheet**
1. Click the **"+"** button to add a new sheet
2. Name it: `CommitteeAndStaff`
3. Add these headers in row 1:
```
id | name | email | username | password | class | role | committeeRole | studentManager | profilePhotoUrl | totalApprovedHours | status | createdAt
```

### **Step 3: Add Admin User**
Add this row to the `CommitteeAndStaff` sheet:

| Column | Value |
|--------|-------|
| id | `admin-001` |
| name | `Admin User` |
| email | `admin@college.edu` |
| username | `admin` |
| password | `admin123` |
| class | `BE` |
| role | `staff` |
| committeeRole | (leave empty) |
| studentManager | (leave empty) |
| profilePhotoUrl | (leave empty) |
| totalApprovedHours | `0` |
| status | `active` |
| createdAt | `2024-01-15T10:00:00.000Z` |

## 📋 **Method 2: Using the Signup Form**

### **Step 1: Use the Web App**
1. Go to your app: `https://rush1618.github.io/Dlle/`
2. Click **"Sign up here"**
3. Fill in the form:
   - **Full Name**: Admin User
   - **Email**: admin@college.edu
   - **Username**: admin
   - **Password**: admin123
   - **Class**: Final Year
   - **Role**: Staff
4. Click **"Create Account"**

### **Step 2: Approve the Signup**
1. Go to your Google Sheets
2. Open the `SignupRequests` sheet
3. Find your admin user request
4. Change the `status` from `pending` to `approved`
5. Copy the user data to `CommitteeAndStaff` sheet

## 🔧 **Test Login**

After creating the admin user, try logging in with:
- **Email**: `admin@college.edu`
- **Password**: `admin123`

## 🎯 **Expected Result**

You should be redirected to the **Staff Dashboard** with full access to:
- ✅ User management
- ✅ Activity management
- ✅ Approval system
- ✅ Data export

## 🚨 **If Login Still Fails**

### **Check These Common Issues:**

1. **Google Apps Script Not Deployed**
   - Go to [Google Apps Script](https://script.google.com)
   - Deploy your script as a web app
   - Update the URL in `js/config.js`

2. **Wrong Sheet Names**
   - Make sure sheet names match exactly:
     - `Students`
     - `CommitteeAndStaff`
     - `SignupRequests`
     - `ClockEntries`
     - `Activities`
     - `Approvals`
     - `Photos`

3. **Missing Headers**
   - Each sheet must have the correct headers in row 1
   - Headers must match exactly (case-sensitive)

4. **CORS Issues**
   - Check browser console for CORS errors
   - Add CORS headers to your Google Apps Script

## 🔍 **Debug Steps**

1. **Open browser console** (F12)
2. **Try to login**
3. **Look for error messages**
4. **Check network tab** for failed requests

## 📞 **Need Help?**

If you're still having issues:
1. Share any error messages from the browser console
2. Confirm your Google Apps Script is deployed
3. Verify your Google Sheets structure

---

**Once you have an admin user working, you can create more users through the web interface!** 🎉 