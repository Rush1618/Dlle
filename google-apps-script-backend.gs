// DLLE Committee Platform - Google Apps Script Backend
// This script handles all backend operations for the DLLE Committee Platform

// Configuration
const CONFIG = {
  SPREADSHEET_ID: '1hiTeBU7GeVfVAO1gQHFDiGkZouyEaizj1nnIGd-as2E',
  DRIVE_FOLDER_ID: '10SbkAoQz5gYg1QWR5Zb3OCFMzZTpY2Mf',
  SHEETS: {
    SIGNUP_REQUESTS: 'SignupRequests',
    STUDENTS: 'Students',
    COMMITTEE_AND_STAFF: 'CommitteeAndStaff',
    CLOCK_ENTRIES: 'ClockEntries',
    ACTIVITIES: 'Activities',
    APPROVALS: 'Approvals',
    PHOTOS: 'Photos'
  }
};

// CORS Headers for GitHub Pages
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

// Main doPost function to handle all API requests
function doPost(e) {
  try {
    // Handle preflight OPTIONS request
    if (e.postData.type === 'application/json' && e.postData.contents === '') {
      return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeaders(getCorsHeaders());
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result;
    switch(action) {
      case 'login':
        result = handleLogin(data);
        break;
      case 'signup':
        result = handleSignup(data);
        break;
      case 'getUsers':
        result = handleGetUsers(data);
        break;
      case 'addUser':
        result = handleAddUser(data);
        break;
      case 'updateUser':
        result = handleUpdateUser(data);
        break;
      case 'deleteUser':
        result = handleDeleteUser(data);
        break;
      case 'getActivities':
        result = handleGetActivities(data);
        break;
      case 'addActivity':
        result = handleAddActivity(data);
        break;
      case 'clockIn':
        result = handleClockIn(data);
        break;
      case 'clockOut':
        result = handleClockOut(data);
        break;
      case 'getClockEntries':
        result = handleGetClockEntries(data);
        break;
      case 'approveEntry':
        result = handleApproveEntry(data);
        break;
      case 'rejectEntry':
        result = handleRejectEntry(data);
        break;
      case 'uploadPhoto':
        result = handleUploadPhoto(data);
        break;
      case 'getSignupRequests':
        result = handleGetSignupRequests(data);
        break;
      case 'approveSignup':
        result = handleApproveSignup(data);
        break;
      case 'rejectSignup':
        result = handleRejectSignup(data);
        break;
      case 'exportData':
        result = handleExportData(data);
        break;
      case 'getUserByEmail':
        result = handleGetUserByEmail(data);
        break;
      default:
        result = createResponse(false, 'Invalid action');
    }
    
    // Add CORS headers to response
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(getCorsHeaders());
      
  } catch (error) {
    console.error('Server error:', error);
    const errorResponse = createResponse(false, 'Server error: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(getCorsHeaders());
  }
}

// Main doGet function for testing
function doGet(e) {
  const response = {
    status: 'success',
    message: 'DLLE Committee Platform API is running',
    timestamp: new Date().toISOString(),
    config: {
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      driveFolderId: CONFIG.DRIVE_FOLDER_ID
    }
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(getCorsHeaders());
}

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(getCorsHeaders());
}

// ==================== AUTHENTICATION FUNCTIONS ====================

function handleLogin(data) {
  const { email, password } = data;
  
  if (!email || !password) {
    return createResponse(false, 'Email and password required');
  }
  
  try {
    // Check in Students sheet
    let user = findUserByEmail(email, CONFIG.SHEETS.STUDENTS);
    if (user && user.password === password) {
      return createResponse(true, 'Login successful', { user: sanitizeUser(user) });
    }
    
    // Check in CommitteeAndStaff sheet
    user = findUserByEmail(email, CONFIG.SHEETS.COMMITTEE_AND_STAFF);
    if (user && user.password === password) {
      return createResponse(true, 'Login successful', { user: sanitizeUser(user) });
    }
    
    return createResponse(false, 'Invalid email or password');
  } catch (error) {
    console.error('Login error:', error);
    return createResponse(false, 'Login failed: ' + error.message);
  }
}

function handleGetUserByEmail(data) {
  const { email } = data;
  
  if (!email) {
    return createResponse(false, 'Email required');
  }
  
  try {
    // Check in Students sheet
    let user = findUserByEmail(email, CONFIG.SHEETS.STUDENTS);
    if (user) {
      return createResponse(true, 'User found', { user: sanitizeUser(user) });
    }
    
    // Check in CommitteeAndStaff sheet
    user = findUserByEmail(email, CONFIG.SHEETS.COMMITTEE_AND_STAFF);
    if (user) {
      return createResponse(true, 'User found', { user: sanitizeUser(user) });
    }
    
    return createResponse(false, 'User not found');
  } catch (error) {
    console.error('Get user error:', error);
    return createResponse(false, 'Failed to get user: ' + error.message);
  }
}

function handleSignup(data) {
  const { name, email, username, password, class: userClass, role, committeeRole, studentManager, profilePhoto } = data;
  
  if (!name || !email || !username || !password || !userClass || !role) {
    return createResponse(false, 'All required fields must be provided');
  }
  
  try {
    // Check if user already exists
    if (findUserByEmail(email, CONFIG.SHEETS.STUDENTS) || findUserByEmail(email, CONFIG.SHEETS.COMMITTEE_AND_STAFF)) {
      return createResponse(false, 'User with this email already exists');
    }
    
    // Handle profile photo upload
    let profilePhotoUrl = '';
    if (profilePhoto) {
      const photoResult = uploadToDrive(profilePhoto, 'profile', email);
      if (photoResult.success) {
        profilePhotoUrl = photoResult.url;
      }
    }
    
    // Create signup request
    const signupData = {
      id: generateId(),
      name: name,
      email: email,
      username: username,
      password: password,
      class: userClass,
      role: role,
      committeeRole: committeeRole || '',
      studentManager: studentManager || '',
      profilePhotoUrl: profilePhotoUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add to SignupRequests sheet
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.SIGNUP_REQUESTS);
    if (!sheet) {
      // Create sheet if it doesn't exist
      const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      const newSheet = spreadsheet.insertSheet(CONFIG.SHEETS.SIGNUP_REQUESTS);
      newSheet.getRange(1, 1, 1, 12).setValues([['id', 'name', 'email', 'username', 'password', 'class', 'role', 'committeeRole', 'studentManager', 'profilePhotoUrl', 'status', 'createdAt']]);
    }
    
    const rowData = [
      signupData.id,
      signupData.name,
      signupData.email,
      signupData.username,
      signupData.password,
      signupData.class,
      signupData.role,
      signupData.committeeRole,
      signupData.studentManager,
      signupData.profilePhotoUrl,
      signupData.status,
      signupData.createdAt
    ];
    
    sheet.appendRow(rowData);
    
    return createResponse(true, 'Signup request submitted successfully. Please wait for approval.');
  } catch (error) {
    console.error('Signup error:', error);
    return createResponse(false, 'Signup failed: ' + error.message);
  }
}

// ==================== USER MANAGEMENT FUNCTIONS ====================

function handleGetUsers(data) {
  const { role, class: userClass } = data;
  
  try {
    let users = [];
    
    // Get students
    if (!role || role === 'student') {
      const studentUsers = getSheetData(CONFIG.SHEETS.STUDENTS);
      users = users.concat(studentUsers);
    }
    
    // Get committee and staff
    if (!role || role === 'committee' || role === 'staff') {
      const committeeUsers = getSheetData(CONFIG.SHEETS.COMMITTEE_AND_STAFF);
      users = users.concat(committeeUsers);
    }
    
    // Filter by class if specified
    if (userClass) {
      users = users.filter(user => user.class === userClass);
    }
    
    // Sanitize user data (remove passwords)
    users = users.map(user => sanitizeUser(user));
    
    return createResponse(true, 'Users retrieved successfully', { users });
  } catch (error) {
    console.error('Get users error:', error);
    return createResponse(false, 'Failed to get users: ' + error.message);
  }
}

function handleAddUser(data) {
  const { name, email, username, password, class: userClass, role, committeeRole, studentManager, profilePhoto, existingHours } = data;
  
  if (!name || !email || !username || !password || !userClass || !role) {
    return createResponse(false, 'All required fields must be provided');
  }
  
  try {
    // Check if user already exists
    if (findUserByEmail(email, CONFIG.SHEETS.STUDENTS) || findUserByEmail(email, CONFIG.SHEETS.COMMITTEE_AND_STAFF)) {
      return createResponse(false, 'User with this email already exists');
    }
    
    // Handle profile photo upload
    let profilePhotoUrl = '';
    if (profilePhoto) {
      const photoResult = uploadToDrive(profilePhoto, 'profile', email);
      if (photoResult.success) {
        profilePhotoUrl = photoResult.url;
      }
    }
    
    // Create user data
    const userData = {
      id: generateId(),
      name: name,
      email: email,
      username: username,
      password: password,
      class: userClass,
      role: role,
      committeeRole: committeeRole || '',
      studentManager: studentManager || '',
      profilePhotoUrl: profilePhotoUrl,
      totalApprovedHours: existingHours || 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    // Add to appropriate sheet
    const sheetName = (role === 'student') ? CONFIG.SHEETS.STUDENTS : CONFIG.SHEETS.COMMITTEE_AND_STAFF;
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    
    if (!sheet) {
      // Create sheet if it doesn't exist
      const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      const newSheet = spreadsheet.insertSheet(sheetName);
      newSheet.getRange(1, 1, 1, 13).setValues([['id', 'name', 'email', 'username', 'password', 'class', 'role', 'committeeRole', 'studentManager', 'profilePhotoUrl', 'totalApprovedHours', 'status', 'createdAt']]);
    }
    
    const rowData = [
      userData.id,
      userData.name,
      userData.email,
      userData.username,
      userData.password,
      userData.class,
      userData.role,
      userData.committeeRole,
      userData.studentManager,
      userData.profilePhotoUrl,
      userData.totalApprovedHours,
      userData.status,
      userData.createdAt
    ];
    
    sheet.appendRow(rowData);
    
    return createResponse(true, 'User added successfully', { user: sanitizeUser(userData) });
  } catch (error) {
    console.error('Add user error:', error);
    return createResponse(false, 'Failed to add user: ' + error.message);
  }
}

// ==================== HELPER FUNCTIONS ====================

function findUserByEmail(email, sheetName) {
  try {
    const users = getSheetData(sheetName);
    return users.find(user => user.email === email);
  } catch (error) {
    console.error('Find user error:', error);
    return null;
  }
}

function getSheetData(sheetName) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) {
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
  } catch (error) {
    console.error('Get sheet data error:', error);
    return [];
  }
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

function generateId() {
  return Utilities.getUuid();
}

function uploadToDrive(photoData, type, email, activity = '') {
  try {
    // Decode base64 data
    const photoBlob = Utilities.newBlob(Utilities.base64Decode(photoData.split(',')[1]));
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let filename = '';
    
    switch(type) {
      case 'profile':
        filename = `${email}_profile_${timestamp}.jpg`;
        break;
      case 'proof':
        filename = `${activity}_${timestamp}_${email}_proof.jpg`;
        break;
      default:
        filename = `${type}_${timestamp}_${email}.jpg`;
    }
    
    photoBlob.setName(filename);
    
    // Upload to Drive
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const file = folder.createFile(photoBlob);
    
    // Make file publicly accessible
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      url: file.getDownloadUrl(),
      fileId: file.getId()
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return response;
}

// ==================== PLACEHOLDER FUNCTIONS ====================
// These will be implemented as needed

function handleUpdateUser(data) {
  return createResponse(false, 'Update user not implemented yet');
}

function handleDeleteUser(data) {
  return createResponse(false, 'Delete user not implemented yet');
}

function handleGetActivities(data) {
  return createResponse(true, 'Activities retrieved successfully', { activities: [] });
}

function handleAddActivity(data) {
  return createResponse(false, 'Add activity not implemented yet');
}

function handleClockIn(data) {
  return createResponse(false, 'Clock in not implemented yet');
}

function handleClockOut(data) {
  return createResponse(false, 'Clock out not implemented yet');
}

function handleGetClockEntries(data) {
  return createResponse(true, 'Clock entries retrieved successfully', { entries: [] });
}

function handleApproveEntry(data) {
  return createResponse(false, 'Approve entry not implemented yet');
}

function handleRejectEntry(data) {
  return createResponse(false, 'Reject entry not implemented yet');
}

function handleUploadPhoto(data) {
  return createResponse(false, 'Upload photo not implemented yet');
}

function handleGetSignupRequests(data) {
  return createResponse(true, 'Signup requests retrieved successfully', { requests: [] });
}

function handleApproveSignup(data) {
  return createResponse(false, 'Approve signup not implemented yet');
}

function handleRejectSignup(data) {
  return createResponse(false, 'Reject signup not implemented yet');
}

function handleExportData(data) {
  return createResponse(false, 'Export data not implemented yet');
} 