# 🚀 Deploy DLLE Committee Platform to GitHub Pages

## ✅ **Step 1: Create GitHub Repository**

1. **Go to GitHub.com**
   - Open your web browser
   - Go to: https://github.com
   - Sign in to your account (or create one if you don't have it)

2. **Create New Repository**
   - Click the **"+"** button in the top right
   - Click **"New repository"**
   - Repository name: `dlle-committee-platform`
   - Make it **"Public"** (required for free GitHub Pages)
   - **Don't** check any boxes (no README, no .gitignore)
   - Click **"Create repository"**

## 🔗 **Step 2: Connect Your Local Project**

1. **Copy the Repository URL**
   - GitHub will show you a page with setup instructions
   - Copy the URL that looks like: `https://github.com/YOUR_USERNAME/dlle-committee-platform.git`

2. **Connect Your Local Project**
   - Go back to your terminal/command prompt
   - Make sure you're in your project folder: `C:\PROJECTS\8th-dlle`
   - Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/dlle-committee-platform.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## 🌐 **Step 3: Enable GitHub Pages**

1. **Go to Repository Settings**
   - In your GitHub repository, click the **"Settings"** tab
   - Scroll down to **"Pages"** in the left sidebar
   - Click on **"Pages"**

2. **Configure GitHub Pages**
   - Under **"Source"**, select **"Deploy from a branch"**
   - Under **"Branch"**, select **"main"**
   - Under **"Folder"**, select **"/ (root)"**
   - Click **"Save"**

3. **Wait for Deployment**
   - GitHub will show a green checkmark when it's ready
   - Your app will be available at: `https://YOUR_USERNAME.github.io/dlle-committee-platform`

## 🔧 **Step 4: Set Up Google Sheets Backend**

**Before your app can work, you need to set up the Google Sheets backend:**

### 4.1 Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"DLLE Committee Platform"**
4. Copy the **spreadsheet ID** from the URL

### 4.2 Set Up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create new project
3. Copy the code from `google-apps-script.gs`
4. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
5. Deploy as web app (set access to "Anyone")
6. Copy the **web app URL**

### 4.3 Update Your App Configuration
1. In your GitHub repository, go to `js/config.js`
2. Click the pencil icon to edit
3. Replace the placeholder values:
```javascript
const GOOGLE_SHEETS_CONFIG = {
    scriptUrl: 'YOUR_WEB_APP_URL_HERE', // Paste your Apps Script URL
    spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE', // Paste your spreadsheet ID
    // ... rest of the config
};
```
4. Click **"Commit changes"**

## 🎯 **Step 5: Test Your Live App**

1. **Visit Your App**
   - Go to: `https://YOUR_USERNAME.github.io/dlle-committee-platform`
   - Your DLLE Committee Platform should be live!

2. **Create First Staff Account**
   - The app will create the database automatically
   - Or manually add a staff user to the Google Sheets

3. **Test All Features**
   - Login system
   - User management
   - Activity creation
   - Clock in/out
   - Reports

## 📱 **Your App is Now Live!**

**URL**: `https://YOUR_USERNAME.github.io/dlle-committee-platform`

**Features Available:**
- ✅ User registration and login
- ✅ Staff dashboard
- ✅ Committee dashboard  
- ✅ Student dashboard
- ✅ Activity management
- ✅ Time tracking
- ✅ Approval system
- ✅ Excel export
- ✅ Mobile responsive

## 🔄 **Making Updates**

**To update your live app:**

1. **Edit files locally**
2. **Commit and push changes:**
```bash
git add .
git commit -m "Update description"
git push
```
3. **GitHub Pages updates automatically** (takes 1-2 minutes)

## 🛠️ **Troubleshooting**

### **App not loading:**
- Check that GitHub Pages is enabled
- Verify the repository is public
- Wait 2-3 minutes for deployment

### **Backend not working:**
- Check Google Apps Script URL
- Verify spreadsheet ID
- Make sure Apps Script is deployed correctly

### **Authentication issues:**
- Check browser console for errors
- Verify all URLs are correct
- Test Apps Script directly

## 🎉 **Congratulations!**

Your DLLE Committee Platform is now:
- ✅ **Live on the internet**
- ✅ **Completely free**
- ✅ **Professional and modern**
- ✅ **Mobile responsive**
- ✅ **Ready for your committee**

**Share the URL with your team and start using it!** 🚀

---

**Need help?** Check the troubleshooting section or contact support. 