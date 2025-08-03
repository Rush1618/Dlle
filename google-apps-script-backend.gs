// DLLE Committee Platform - Google Apps Script Backend
// This script handles all backend operations for the DLLE Committee Platform

// Configuration
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
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

// Main doPost function to handle all API requests
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'login':
        return handleLogin(data);
      case 'signup':
        return handleSignup(data);
      case 'getUsers':
        return handleGetUsers(data);
      case 'addUser':
        return handleAddUser(data);
      case 'updateUser':
        return handleUpdateUser(data);
      case 'deleteUser':
        return handleDeleteUser(data);
      case 'getActivities':
        return handleGetActivities(data);
      case 'addActivity':
        return handleAddActivity(data);
      case 'clockIn':
        return handleClockIn(data);
      case 'clockOut':
        return handleClockOut(data);
      case 'getClockEntries':
        return handleGetClockEntries(data);
      case 'approveEntry':
        return handleApproveEntry(data);
      case 'rejectEntry':
        return handleRejectEntry(data);
      case 'uploadPhoto':
        return handleUploadPhoto(data);
      case 'getSignupRequests':
        return handleGetSignupRequests(data);
      case 'approveSignup':
        return handleApproveSignup(data);
      case 'rejectSignup':
        return handleRejectSignup(data);
      case 'exportData':
        return handleExportData(data);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    return createResponse(false, 'Server error: ' + error.message);
  }
}

// Main doGet function for testing
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'DLLE Committee Platform API is running',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// ==================== AUTHENTICATION FUNCTIONS ====================

function handleLogin(data) {
  const { email, password } = data;
  
  if (!email || !password) {
    return createResponse(false, 'Email and password required');
  }
  
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
}

function handleSignup(data) {
  const { name, email, username, password, class: userClass, role, committeeRole, studentManager, profilePhoto } = data;
  
  if (!name || !email || !username || !password || !userClass || !role) {
    return createResponse(false, 'All required fields must be provided');
  }
  
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
}

// ==================== USER MANAGEMENT FUNCTIONS ====================

function handleGetUsers(data) {
  const { role, class: userClass } = data;
  
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
}

function handleAddUser(data) {
  const { name, email, username, password, class: userClass, role, committeeRole, studentManager, profilePhoto, existingHours } = data;
  
  if (!name || !email || !username || !password || !userClass || !role) {
    return createResponse(false, 'All required fields must be provided');
  }
  
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
}

function handleUpdateUser(data) {
  const { id, name, email, username, class: userClass, role, committeeRole, studentManager, profilePhoto, totalApprovedHours } = data;
  
  if (!id) {
    return createResponse(false, 'User ID required');
  }
  
  // Find user in appropriate sheet
  let user = findUserById(id, CONFIG.SHEETS.STUDENTS);
  let sheetName = CONFIG.SHEETS.STUDENTS;
  
  if (!user) {
    user = findUserById(id, CONFIG.SHEETS.COMMITTEE_AND_STAFF);
    sheetName = CONFIG.SHEETS.COMMITTEE_AND_STAFF;
  }
  
  if (!user) {
    return createResponse(false, 'User not found');
  }
  
  // Handle profile photo upload if provided
  let profilePhotoUrl = user.profilePhotoUrl;
  if (profilePhoto) {
    const photoResult = uploadToDrive(profilePhoto, 'profile', email);
    if (photoResult.success) {
      profilePhotoUrl = photoResult.url;
    }
  }
  
  // Update user data
  const updatedData = {
    ...user,
    name: name || user.name,
    email: email || user.email,
    username: username || user.username,
    class: userClass || user.class,
    role: role || user.role,
    committeeRole: committeeRole || user.committeeRole,
    studentManager: studentManager || user.studentManager,
    profilePhotoUrl: profilePhotoUrl,
    totalApprovedHours: totalApprovedHours !== undefined ? totalApprovedHours : user.totalApprovedHours
  };
  
  // Update in sheet
  updateUserInSheet(updatedData, sheetName);
  
  return createResponse(true, 'User updated successfully', { user: sanitizeUser(updatedData) });
}

function handleDeleteUser(data) {
  const { id } = data;
  
  if (!id) {
    return createResponse(false, 'User ID required');
  }
  
  // Find and delete user from appropriate sheet
  let deleted = deleteUserFromSheet(id, CONFIG.SHEETS.STUDENTS);
  if (!deleted) {
    deleted = deleteUserFromSheet(id, CONFIG.SHEETS.COMMITTEE_AND_STAFF);
  }
  
  if (!deleted) {
    return createResponse(false, 'User not found');
  }
  
  return createResponse(true, 'User deleted successfully');
}

// ==================== ACTIVITY MANAGEMENT FUNCTIONS ====================

function handleGetActivities(data) {
  const activities = getSheetData(CONFIG.SHEETS.ACTIVITIES);
  return createResponse(true, 'Activities retrieved successfully', { activities });
}

function handleAddActivity(data) {
  const { name, date, description } = data;
  
  if (!name || !date) {
    return createResponse(false, 'Activity name and date required');
  }
  
  const activityData = {
    id: generateId(),
    name: name,
    date: date,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.ACTIVITIES);
  const rowData = [
    activityData.id,
    activityData.name,
    activityData.date,
    activityData.description,
    activityData.createdAt
  ];
  
  sheet.appendRow(rowData);
  
  return createResponse(true, 'Activity added successfully', { activity: activityData });
}

// ==================== CLOCK IN/OUT FUNCTIONS ====================

function handleClockIn(data) {
  const { name, email, activity, role } = data;
  
  if (!name || !email || !activity) {
    return createResponse(false, 'Name, email, and activity required');
  }
  
  // Check if user is already clocked in
  const currentEntries = getSheetData(CONFIG.SHEETS.CLOCK_ENTRIES);
  const activeEntry = currentEntries.find(entry => 
    entry.email === email && entry.status === 'active'
  );
  
  if (activeEntry) {
    return createResponse(false, 'You are already clocked in to an activity');
  }
  
  const clockEntry = {
    id: generateId(),
    name: name,
    email: email,
    activity: activity,
    clockIn: new Date().toISOString(),
    clockOut: '',
    status: 'active',
    approvedBy: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    role: role || 'student'
  };
  
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.CLOCK_ENTRIES);
  const rowData = [
    clockEntry.id,
    clockEntry.name,
    clockEntry.email,
    clockEntry.activity,
    clockEntry.clockIn,
    clockEntry.clockOut,
    clockEntry.status,
    clockEntry.approvedBy,
    clockEntry.imageUrl,
    clockEntry.date,
    clockEntry.role
  ];
  
  sheet.appendRow(rowData);
  
  return createResponse(true, 'Clocked in successfully', { entry: clockEntry });
}

function handleClockOut(data) {
  const { email, proofPhoto } = data;
  
  if (!email) {
    return createResponse(false, 'Email required');
  }
  
  // Find active clock entry
  const currentEntries = getSheetData(CONFIG.SHEETS.CLOCK_ENTRIES);
  const activeEntry = currentEntries.find(entry => 
    entry.email === email && entry.status === 'active'
  );
  
  if (!activeEntry) {
    return createResponse(false, 'No active clock entry found');
  }
  
  // Handle proof photo upload
  let imageUrl = '';
  if (proofPhoto) {
    const photoResult = uploadToDrive(proofPhoto, 'proof', email);
    if (photoResult.success) {
      imageUrl = photoResult.url;
    }
  }
  
  // Update clock entry
  const updatedEntry = {
    ...activeEntry,
    clockOut: new Date().toISOString(),
    status: 'pending',
    imageUrl: imageUrl
  };
  
  updateClockEntryInSheet(updatedEntry);
  
  return createResponse(true, 'Clocked out successfully. Waiting for approval.', { entry: updatedEntry });
}

function handleGetClockEntries(data) {
  const { activity, status, email } = data;
  
  let entries = getSheetData(CONFIG.SHEETS.CLOCK_ENTRIES);
  
  // Filter by activity if specified
  if (activity) {
    entries = entries.filter(entry => entry.activity === activity);
  }
  
  // Filter by status if specified
  if (status) {
    entries = entries.filter(entry => entry.status === status);
  }
  
  // Filter by email if specified
  if (email) {
    entries = entries.filter(entry => entry.email === email);
  }
  
  return createResponse(true, 'Clock entries retrieved successfully', { entries });
}

// ==================== APPROVAL FUNCTIONS ====================

function handleApproveEntry(data) {
  const { entryId, approvedBy } = data;
  
  if (!entryId || !approvedBy) {
    return createResponse(false, 'Entry ID and approver required');
  }
  
  // Find and update clock entry
  const entries = getSheetData(CONFIG.SHEETS.CLOCK_ENTRIES);
  const entry = entries.find(e => e.id === entryId);
  
  if (!entry) {
    return createResponse(false, 'Entry not found');
  }
  
  // Calculate duration
  const clockIn = new Date(entry.clockIn);
  const clockOut = new Date(entry.clockOut);
  const duration = (clockOut - clockIn) / (1000 * 60 * 60); // hours
  
  // Update entry status
  const updatedEntry = {
    ...entry,
    status: 'approved',
    approvedBy: approvedBy
  };
  
  updateClockEntryInSheet(updatedEntry);
  
  // Add approval record
  const approvalData = {
    id: generateId(),
    entryId: entryId,
    approvedBy: approvedBy,
    approvedAt: new Date().toISOString(),
    status: 'approved',
    comments: ''
  };
  
  const approvalSheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.APPROVALS);
  const approvalRow = [
    approvalData.id,
    approvalData.entryId,
    approvalData.approvedBy,
    approvalData.approvedAt,
    approvalData.status,
    approvalData.comments
  ];
  
  approvalSheet.appendRow(approvalRow);
  
  // Update user's total approved hours
  updateUserHours(entry.email, duration);
  
  return createResponse(true, 'Entry approved successfully', { 
    entry: updatedEntry, 
    duration: duration.toFixed(2) 
  });
}

function handleRejectEntry(data) {
  const { entryId, approvedBy, comments } = data;
  
  if (!entryId || !approvedBy) {
    return createResponse(false, 'Entry ID and approver required');
  }
  
  // Find and update clock entry
  const entries = getSheetData(CONFIG.SHEETS.CLOCK_ENTRIES);
  const entry = entries.find(e => e.id === entryId);
  
  if (!entry) {
    return createResponse(false, 'Entry not found');
  }
  
  // Update entry status
  const updatedEntry = {
    ...entry,
    status: 'rejected',
    approvedBy: approvedBy
  };
  
  updateClockEntryInSheet(updatedEntry);
  
  // Add approval record
  const approvalData = {
    id: generateId(),
    entryId: entryId,
    approvedBy: approvedBy,
    approvedAt: new Date().toISOString(),
    status: 'rejected',
    comments: comments || ''
  };
  
  const approvalSheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.APPROVALS);
  const approvalRow = [
    approvalData.id,
    approvalData.entryId,
    approvalData.approvedBy,
    approvalData.approvedAt,
    approvalData.status,
    approvalData.comments
  ];
  
  approvalSheet.appendRow(approvalRow);
  
  return createResponse(true, 'Entry rejected successfully', { entry: updatedEntry });
}

// ==================== SIGNUP APPROVAL FUNCTIONS ====================

function handleGetSignupRequests(data) {
  const requests = getSheetData(CONFIG.SHEETS.SIGNUP_REQUESTS);
  const pendingRequests = requests.filter(req => req.status === 'pending');
  
  return createResponse(true, 'Signup requests retrieved successfully', { requests: pendingRequests });
}

function handleApproveSignup(data) {
  const { requestId, approvedBy } = data;
  
  if (!requestId || !approvedBy) {
    return createResponse(false, 'Request ID and approver required');
  }
  
  // Find signup request
  const requests = getSheetData(CONFIG.SHEETS.SIGNUP_REQUESTS);
  const request = requests.find(req => req.id === requestId);
  
  if (!request) {
    return createResponse(false, 'Request not found');
  }
  
  // Create user data
  const userData = {
    id: generateId(),
    name: request.name,
    email: request.email,
    username: request.username,
    password: request.password,
    class: request.class,
    role: request.role,
    committeeRole: request.committeeRole,
    studentManager: request.studentManager,
    profilePhotoUrl: request.profilePhotoUrl,
    totalApprovedHours: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  // Add to appropriate sheet
  const sheetName = (request.role === 'student') ? CONFIG.SHEETS.STUDENTS : CONFIG.SHEETS.COMMITTEE_AND_STAFF;
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
  
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
  
  // Update request status
  updateSignupRequestStatus(requestId, 'approved');
  
  return createResponse(true, 'Signup approved successfully', { user: sanitizeUser(userData) });
}

function handleRejectSignup(data) {
  const { requestId, approvedBy, comments } = data;
  
  if (!requestId || !approvedBy) {
    return createResponse(false, 'Request ID and approver required');
  }
  
  // Update request status
  updateSignupRequestStatus(requestId, 'rejected');
  
  return createResponse(true, 'Signup rejected successfully');
}

// ==================== PHOTO UPLOAD FUNCTIONS ====================

function handleUploadPhoto(data) {
  const { photoData, type, email, activity } = data;
  
  if (!photoData || !type || !email) {
    return createResponse(false, 'Photo data, type, and email required');
  }
  
  const photoResult = uploadToDrive(photoData, type, email, activity);
  
  if (photoResult.success) {
    // Add photo record
    const photoRecord = {
      id: generateId(),
      name: email,
      email: email,
      imageUrl: photoResult.url,
      activity: activity || '',
      timestamp: new Date().toISOString(),
      role: 'student',
      type: type
    };
    
    const photoSheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.PHOTOS);
    const photoRow = [
      photoRecord.id,
      photoRecord.name,
      photoRecord.email,
      photoRecord.imageUrl,
      photoRecord.activity,
      photoRecord.timestamp,
      photoRecord.role,
      photoRecord.type
    ];
    
    photoSheet.appendRow(photoRow);
    
    return createResponse(true, 'Photo uploaded successfully', { 
      url: photoResult.url,
      photo: photoRecord 
    });
  } else {
    return createResponse(false, 'Failed to upload photo: ' + photoResult.error);
  }
}

// ==================== EXPORT FUNCTIONS ====================

function handleExportData(data) {
  const { type, class: userClass, dateRange } = data;
  
  let exportData = [];
  
  switch(type) {
    case 'students':
      exportData = getSheetData(CONFIG.SHEETS.STUDENTS);
      if (userClass) {
        exportData = exportData.filter(user => user.class === userClass);
      }
      break;
      
    case 'clockEntries':
      exportData = getSheetData(CONFIG.SHEETS.CLOCK_ENTRIES);
      if (dateRange) {
        // Filter by date range
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        exportData = exportData.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });
      }
      break;
      
    case 'activities':
      exportData = getSheetData(CONFIG.SHEETS.ACTIVITIES);
      break;
      
    default:
      return createResponse(false, 'Invalid export type');
  }
  
  // Create CSV data
  const csvData = convertToCSV(exportData);
  
  return createResponse(true, 'Export data generated successfully', { 
    data: csvData,
    count: exportData.length 
  });
}

// ==================== HELPER FUNCTIONS ====================

function findUserByEmail(email, sheetName) {
  const users = getSheetData(sheetName);
  return users.find(user => user.email === email);
}

function findUserById(id, sheetName) {
  const users = getSheetData(sheetName);
  return users.find(user => user.id === id);
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
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
}

function sanitizeUser(user) {
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
    return {
      success: false,
      error: error.message
    };
  }
}

function updateUserInSheet(userData, sheetName) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userData.id) {
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
      
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
      break;
    }
  }
}

function deleteUserFromSheet(userId, sheetName) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  return false;
}

function updateClockEntryInSheet(entryData) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.CLOCK_ENTRIES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === entryData.id) {
      const rowData = [
        entryData.id,
        entryData.name,
        entryData.email,
        entryData.activity,
        entryData.clockIn,
        entryData.clockOut,
        entryData.status,
        entryData.approvedBy,
        entryData.imageUrl,
        entryData.date,
        entryData.role
      ];
      
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
      break;
    }
  }
}

function updateUserHours(email, hours) {
  // Update in Students sheet
  let user = findUserByEmail(email, CONFIG.SHEETS.STUDENTS);
  if (user) {
    user.totalApprovedHours = parseFloat(user.totalApprovedHours || 0) + parseFloat(hours);
    updateUserInSheet(user, CONFIG.SHEETS.STUDENTS);
    return;
  }
  
  // Update in CommitteeAndStaff sheet
  user = findUserByEmail(email, CONFIG.SHEETS.COMMITTEE_AND_STAFF);
  if (user) {
    user.totalApprovedHours = parseFloat(user.totalApprovedHours || 0) + parseFloat(hours);
    updateUserInSheet(user, CONFIG.SHEETS.COMMITTEE_AND_STAFF);
  }
}

function updateSignupRequestStatus(requestId, status) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEETS.SIGNUP_REQUESTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === requestId) {
      sheet.getRange(i + 1, 11).setValue(status); // status column
      break;
    }
  }
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
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
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
} 