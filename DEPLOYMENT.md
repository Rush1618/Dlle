# DLLE Committee Platform - Deployment Guide

## 🚀 Quick Deployment Steps

### Step 1: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Enter project name: `dlle-committee-platform`
   - Enable Google Analytics (optional)
   - Click "Create project"

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password"
   - Click "Save"

3. **Create Firestore Database**
   - Go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select location closest to your users
   - Click "Done"

4. **Enable Storage**
   - Go to "Storage"
   - Click "Get started"
   - Choose "Start in test mode"
   - Select location
   - Click "Done"

5. **Get Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" > "Web"
   - Register app with name "DLLE Platform"
   - Copy the configuration object

### Step 2: Update Configuration

1. **Edit `js/config.js`**
   ```javascript
   const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id"
   };
   ```

2. **Replace all placeholder values** with your actual Firebase configuration

### Step 3: GitHub Pages Deployment

1. **Create GitHub Repository**
   - Go to GitHub.com
   - Click "New repository"
   - Name: `dlle-committee-platform`
   - Make it public
   - Don't initialize with README (we already have one)

2. **Upload Files**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DLLE Committee Platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/dlle-committee-platform.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
   - Click "Save"

4. **Your app will be available at:**
   `https://yourusername.github.io/dlle-committee-platform`

### Step 4: Security Rules Setup

1. **Firestore Rules**
   - Go to Firestore Database > Rules
   - Replace with:
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

2. **Storage Rules**
   - Go to Storage > Rules
   - Replace with:
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

### Step 5: Initial Setup

1. **Create First Staff Account**
   - Deploy the app
   - Go to Firebase Console > Authentication
   - Click "Add user"
   - Enter email and password
   - Go to Firestore Database
   - Create document in `users` collection with:
   ```javascript
   {
     uid: "user-uid-from-auth",
     name: "Admin User",
     email: "admin@example.com",
     username: "admin",
     role: "staff",
     totalApprovedHours: 0,
     createdAt: serverTimestamp()
   }
   ```

2. **Test the System**
   - Login with staff account
   - Create some test activities
   - Test student signup process
   - Verify all functionality works

## 🔧 Configuration Options

### Custom Domain (Optional)
1. Go to GitHub repository Settings > Pages
2. Add custom domain
3. Update DNS records
4. Enable HTTPS

### Firebase Hosting (Alternative)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🛠️ Maintenance

### Regular Tasks
- Monitor Firebase usage (free tier limits)
- Backup data regularly
- Update security rules as needed
- Monitor for errors in Firebase Console

### Troubleshooting
- Check browser console for errors
- Verify Firebase configuration
- Test authentication flow
- Check Firestore rules

## 📞 Support

For technical issues:
1. Check Firebase Console for errors
2. Review browser console logs
3. Verify all configuration values
4. Test on different browsers/devices

## 🎯 Next Steps

After deployment:
1. Create staff accounts
2. Set up activities
3. Train committee members
4. Start student onboarding
5. Monitor system usage

---

**Your DLLE Committee Platform is now ready! 🎉** 