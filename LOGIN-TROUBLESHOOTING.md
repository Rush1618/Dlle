# 🔧 Login Troubleshooting Guide

## 🚨 **Login Failed - Common Issues & Solutions**

### **Issue 1: Google Apps Script Not Deployed**
**Symptoms**: Login fails with network error or 404

**Solution**:
1. Go to [Google Apps Script](https://script.google.com)
2. Open your "DLLE Backend" project
3. Click **"Deploy"** → **"New deployment"**
4. **Type**: "Web app"
5. **Execute as**: "Me"
6. **Who has access**: "Anyone"
7. Click **"Deploy"**
8. Copy the new URL and update `js/config.js`

### **Issue 2: Google Sheets Not Set Up**
**Symptoms**: Login fails with "User not found" or database error

**Solution**:
1. Go to [Google Sheets](https://sheets.google.com)
2. Open your spreadsheet: `1hiTeBU7GeVfVAO1gQHFDiGkZouyEaizj1nnIGd-as2E`
3. Create these sheets if they don't exist:
   - `Students`
   - `CommitteeAndStaff`
   - `SignupRequests`
   - `ClockEntries`
   - `Activities`
   - `Approvals`
   - `Photos`

4. **Add headers to each sheet**:

#### **Students Sheet Headers**:
```
id | name | email | username | password | class | role | committeeRole | studentManager | profilePhotoUrl | totalApprovedHours | status | createdAt
```

#### **CommitteeAndStaff Sheet Headers**:
```
id | name | email | username | password | class | role | committeeRole | studentManager | profilePhotoUrl | totalApprovedHours | status | createdAt
```

#### **SignupRequests Sheet Headers**:
```
id | name | email | username | password | class | role | committeeRole | studentManager | profilePhotoUrl | status | createdAt
```

### **Issue 3: No Users in Database**
**Symptoms**: Login fails with "User not found"

**Solution**:
1. **Create a test admin user**:
   - Go to your Google Sheets
   
   - Add a row to `CommitteeAndStaff` sheet:
   ```
   [GENERATE_ID] | Admin User | admin@college.edu | admin | password123 | BE | staff | | | | 0 | active | [CURRENT_DATE]
   ```

2. **Or use the signup form** to create your first user

### **Issue 4: CORS Issues**
**Symptoms**: Login fails with CORS error in browser console

**Solution**:
1. In Google Apps Script, add this to the top of your code:
```javascript
function doPost(e) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Handle preflight requests
  if (e.postData.type === 'application/json') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'CORS preflight handled'
    })).setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
  
  // Your existing code here...
}
```

### **Issue 5: Wrong Configuration**
**Symptoms**: Login fails with configuration error

**Solution**:
1. Check `js/config.js` has correct values:
```javascript
const GOOGLE_SHEETS_CONFIG = {
    scriptUrl: 'YOUR_ACTUAL_APPS_SCRIPT_URL',
    spreadsheetId: 'YOUR_ACTUAL_SPREADSHEET_ID',
    // ... rest of config
};
```

## 🔍 **Debug Steps**

### **Step 1: Test Connection**
Add this to your browser console:
```javascript
// Test basic connection
fetch('YOUR_APPS_SCRIPT_URL', {
    method: 'GET'
}).then(response => {
    console.log('Status:', response.status);
    return response.json();
}).then(data => {
    console.log('Data:', data);
}).catch(error => {
    console.error('Error:', error);
});
```

### **Step 2: Test Login**
Add this to your browser console:
```javascript
// Test login
fetch('YOUR_APPS_SCRIPT_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'login',
        email: 'admin@college.edu',
        password: 'password123'
    })
}).then(response => {
    console.log('Status:', response.status);
    return response.json();
}).then(data => {
    console.log('Data:', data);
}).catch(error => {
    console.error('Error:', error);
});
```

### **Step 3: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for error messages
5. Share any error messages for further debugging

## 🎯 **Quick Fix Checklist**

- [ ] Google Apps Script deployed as web app
- [ ] Google Sheets created with correct headers
- [ ] At least one user exists in database
- [ ] Configuration URLs are correct
- [ ] CORS headers added to Apps Script
- [ ] Browser console checked for errors

## 🆘 **Still Having Issues?**

If you're still experiencing login problems:

1. **Check the browser console** for specific error messages
2. **Verify your Google Apps Script URL** is accessible
3. **Confirm your Google Sheets ID** is correct
4. **Test with a simple user** in the database
5. **Share any error messages** for specific help

## 🎉 **Success Indicators**

When login is working correctly, you should see:
- ✅ **Login successful** message
- ✅ **Redirect to dashboard** based on user role
- ✅ **User information** displayed correctly
- ✅ **No console errors**

---

**Need more help? Check the browser console and share any error messages!** 🔧 