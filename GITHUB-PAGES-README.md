# DLLE - GitHub Pages Deployment

This application has been converted to use separate HTML pages for better compatibility with GitHub Pages. The single-page application (SPA) approach has been replaced with individual HTML files for each section.

## File Structure

### Main Pages
- `index.html` - Entry point that redirects to appropriate page based on user session
- `login.html` - Login page for all users
- `signup.html` - Registration page for new users
- `dashboard-staff.html` - Staff and admin dashboard
- `dashboard-committee.html` - Committee member dashboard  
- `dashboard-student.html` - Student dashboard

### Supporting Files
- `js/` - JavaScript modules (unchanged)
- `styles/` - CSS stylesheets (unchanged)
- `assets/` - Images and other assets (unchanged)

## How It Works

1. **Entry Point**: `index.html` checks if user is logged in and redirects accordingly
2. **Authentication**: Users start at `login.html` or `signup.html`
3. **Role-Based Routing**: After login, users are redirected to their appropriate dashboard:
   - Staff/Admin → `dashboard-staff.html`
   - Committee → `dashboard-committee.html`
   - Students → `dashboard-student.html`

## Benefits for GitHub Pages

- **No Routing Issues**: Each page is a separate HTML file, avoiding SPA routing problems
- **Direct Access**: Users can bookmark specific pages
- **Better SEO**: Each page has its own URL
- **Simpler Deployment**: No need for complex routing configuration

## Usage

1. Deploy all files to GitHub Pages
2. Set `index.html` as the default page
3. Users will be automatically redirected to the appropriate page based on their role and login status

## Authentication Flow

1. User visits the site → `index.html` → redirects to `login.html`
2. User logs in → redirects to appropriate dashboard
3. User logs out → redirects back to `login.html`
4. If user is already logged in → `index.html` redirects directly to dashboard

## Notes

- All JavaScript functionality remains the same
- Session management uses localStorage
- Google Apps Script backend integration unchanged
- All existing features and functionality preserved

## Troubleshooting

If pages don't load properly on GitHub Pages:
1. Ensure all file paths are relative (not absolute)
2. Check that all JavaScript and CSS files are properly linked
3. Verify that the Google Apps Script deployment is working
4. Check browser console for any JavaScript errors 