# Firebase Setup for DLLE Management Platform

## ✅ Your Firebase Project is Ready!

**Project ID**: `dlle-management`  
**Project URL**: https://dlle-management.firebaseapp.com

## 🔧 Required Firebase Services Setup

### 1. Authentication Setup
1. Go to [Firebase Console](https://console.firebase.google.com/project/dlle-management)
2. Navigate to **Authentication** > **Sign-in method**
3. Enable **Email/Password** authentication
4. Click **Save**

### 2. Firestore Database Setup
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Done**

### 3. Storage Setup
1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select the same location as Firestore
5. Click **Done**

## 🔒 Security Rules Setup

### Firestore Rules
Go to **Firestore Database** > **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Staff can manage all users
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff';
    }
    
    // Signup requests - staff and committee can read, staff can write
    match /signupRequests/{requestId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'student_manager', 'technical_head', 'event_manager_head'];
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff';
    }
    
    // Activities - all authenticated users can read, staff can write
    match /activities/{activityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff';
    }
    
    // Attendance - users can read their own, staff/committee can read all, users can create
    match /attendance/{attendanceId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'student_manager', 'technical_head', 'event_manager_head']);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'student_manager', 'technical_head', 'event_manager_head'];
    }
  }
}
```

### Storage Rules
Go to **Storage** > **Rules** and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 👤 Create First Staff Account

### Method 1: Firebase Console
1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter email: `admin@dlle.com`
4. Enter password: `admin123456`
5. Click **Add user**

### Method 2: Add User Document
1. Go to **Firestore Database**
2. Create collection: `users`
3. Add document with ID: `[user-uid-from-auth]`
4. Add fields:
```javascript
{
  uid: "[user-uid-from-auth]",
  name: "Admin User",
  email: "admin@dlle.com",
  username: "admin",
  role: "staff",
  totalApprovedHours: 0,
  createdAt: serverTimestamp()
}
```

## 🚀 Test Your Setup

1. **Open your web app** (deploy to GitHub Pages or open locally)
2. **Login with staff account**:
   - Email: `admin@dlle.com`
   - Password: `admin123456`
3. **Test features**:
   - Create activities
   - Add users
   - Test clock in/out
   - Export data

## 📊 Monitor Usage

- **Firebase Console**: Monitor usage, errors, and performance
- **Authentication**: View user signups and logins
- **Firestore**: Monitor database operations
- **Storage**: Check file uploads

## 🔧 Troubleshooting

### Common Issues:
1. **Authentication not working**: Check if Email/Password is enabled
2. **Database errors**: Verify Firestore rules
3. **File upload issues**: Check Storage rules
4. **Permission errors**: Ensure user roles are set correctly

### Debug Steps:
1. Check browser console for errors
2. Verify Firebase configuration in `js/config.js`
3. Test authentication in Firebase Console
4. Check Firestore rules syntax

## 📈 Next Steps

1. **Deploy to GitHub Pages** (follow `DEPLOYMENT.md`)
2. **Create committee member accounts**
3. **Add sample activities**
4. **Train users on the system**
5. **Monitor and maintain**

---

**Your DLLE Management Platform is now connected to Firebase! 🎉**

*Project URL: https://dlle-management.firebaseapp.com* 