# 📁 Google Drive Setup for DLLE Committee Platform

## 🎯 **Your Google Drive Folder**
**Folder ID**: `10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf`  
**URL**: [https://drive.google.com/drive/folders/10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf](https://drive.google.com/drive/folders/10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf)

## 📂 **Required Folder Structure**

Create these subfolders in your main DLLE folder:

### **1. Profile Photos**
- **Purpose**: Store user profile pictures
- **Permissions**: Anyone with link can view
- **Naming**: `user_email_profile.jpg`

### **2. Proof Photos**
- **Purpose**: Store clock in/out proof photos
- **Permissions**: Anyone with link can view
- **Naming**: `activity_date_user_proof.jpg`

### **3. Event Photos**
- **Purpose**: Store event documentation photos
- **Permissions**: Anyone with link can view
- **Naming**: `event_name_date_photo.jpg`

### **4. Documents**
- **Purpose**: Store reports and exports
- **Permissions**: Anyone with link can view
- **Naming**: `report_type_date.xlsx`

## 🔧 **Step-by-Step Setup**

### **Step 1: Create Subfolders**
1. Open your [DLLE folder](https://drive.google.com/drive/folders/10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf)
2. Right-click → **"New folder"**
3. Create these folders:
   - `Profile Photos`
   - `Proof Photos`
   - `Event Photos`
   - `Documents`

### **Step 2: Set Permissions**
For each subfolder:
1. Right-click the folder
2. Click **"Share"**
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

### **Step 3: Get Folder IDs**
After creating each folder, copy the folder ID from the URL:
- Profile Photos: `[folder_id_1]`
- Proof Photos: `[folder_id_2]`
- Event Photos: `[folder_id_3]`
- Documents: `[folder_id_4]`

## 📝 **Update Configuration**

Update your `js/config.js` file:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    scriptUrl: 'YOUR_APPS_SCRIPT_URL',
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    
    // Google Drive Configuration
    drive: {
        mainFolderId: '10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf',
        profilePhotosFolderId: '[PROFILE_PHOTOS_FOLDER_ID]',
        proofPhotosFolderId: '[PROOF_PHOTOS_FOLDER_ID]',
        eventPhotosFolderId: '[EVENT_PHOTOS_FOLDER_ID]',
        documentsFolderId: '[DOCUMENTS_FOLDER_ID]'
    },
    
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
```

## 🖼️ **Photo Upload System**

### **Profile Photos**
- **Upload Location**: Profile Photos folder
- **File Naming**: `user_email_profile.jpg`
- **Access**: Public view for website display
- **Storage**: URL stored in user data

### **Proof Photos**
- **Upload Location**: Proof Photos folder
- **File Naming**: `activity_date_user_proof.jpg`
- **Access**: Public view for approval process
- **Storage**: URL stored in clock entry data

### **Event Photos**
- **Upload Location**: Event Photos folder
- **File Naming**: `event_name_date_photo.jpg`
- **Access**: Public view for event documentation
- **Storage**: URL stored in activity data

## 📊 **File Organization**

### **Example File Structure**
```
DLLE Committee Platform/
├── Profile Photos/
│   ├── john.doe@college.edu_profile.jpg
│   ├── jane.smith@college.edu_profile.jpg
│   └── ...
├── Proof Photos/
│   ├── workshop_2024-01-15_john.doe_proof.jpg
│   ├── seminar_2024-01-20_jane.smith_proof.jpg
│   └── ...
├── Event Photos/
│   ├── tech_fest_2024-01-10_photo1.jpg
│   ├── tech_fest_2024-01-10_photo2.jpg
│   └── ...
└── Documents/
    ├── student_report_2024-01.xlsx
    ├── activity_summary_2024-01.xlsx
    └── ...
```

## 🔒 **Security Considerations**

### **Public Access**
- All photos are publicly viewable
- URLs are stored in Google Sheets
- No sensitive information in photos
- Photos are for verification purposes only

### **File Management**
- Regular cleanup of old files
- Backup important documents
- Monitor storage usage
- Archive completed events

## 🚀 **Integration with Apps Script**

Your Google Apps Script will:
1. **Upload photos** to appropriate folders
2. **Generate public URLs** for each file
3. **Store URLs** in Google Sheets
4. **Handle file permissions** automatically
5. **Manage file naming** conventions

## 📋 **Next Steps**

1. ✅ **Create subfolders** in your Drive
2. ✅ **Set permissions** for public access
3. ✅ **Get folder IDs** for configuration
4. ✅ **Update config.js** with folder IDs
5. ✅ **Test photo uploads** in your app

## 🎯 **Benefits**

- **Organized storage** of all platform files
- **Public access** for website display
- **Automatic URL generation** for easy embedding
- **Scalable structure** for future growth
- **Easy backup** and management

---

**Your Google Drive is now ready to store all DLLE Committee Platform photos and documents!** 📁✨ 