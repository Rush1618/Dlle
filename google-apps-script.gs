// Google Apps Script Backend for DLLE Committee Platform
// Deploy this as a web app to handle all database operations

// Main function to handle all requests
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const requestData = data.data || {};
    
    let result;
    
    switch(action) {
      case 'getUsers':
        result = getUsers();
        break;
      case 'getStudents':
        result = getStudents();
        break;
      case 'addUser':
        result = addUser(requestData);
        break;
      case 'updateUser':
        result = updateUser(requestData);
        break;
      case 'deleteUser':
        result = deleteUser(requestData);
        break;
      case 'getUserByEmail':
        result = getUserByEmail(requestData.email);
        break;
      case 'getUserById':
        result = getUserById(requestData.userId);
        break;
      case 'getActivities':
        result = getActivities();
        break;
      case 'addActivity':
        result = addActivity(requestData);
        break;
      case 'updateActivity':
        result = updateActivity(requestData);
        break;
      case 'deleteActivity':
        result = deleteActivity(requestData);
        break;
      case 'clockIn':
        result = clockIn(requestData);
        break;
      case 'clockOut':
        result = clockOut(requestData);
        break;
      case 'getAttendanceByActivity':
        result = getAttendanceByActivity(requestData.activityId);
        break;
      case 'getUserAttendance':
        result = getUserAttendance(requestData.userId);
        break;
      case 'approveAttendance':
        result = approveAttendance(requestData);
        break;
      case 'rejectAttendance':
        result = rejectAttendance(requestData);
        break;
      case 'isUserClockedIn':
        result = isUserClockedIn(requestData.userId);
        break;
      case 'getSignupRequests':
        result = getSignupRequests();
        break;
      case 'addSignupRequest':
        result = addSignupRequest(requestData);
        break;
      case 'approveSignupRequest':
        result = approveSignupRequest(requestData);
        break;
      case 'rejectSignupRequest':
        result = rejectSignupRequest(requestData);
        break;
      case 'getExportData':
        result = getExportData(requestData.classFilter);
        break;
      case 'searchUsers':
        result = searchUsers(requestData.searchTerm);
        break;
      default:
        throw new Error('Unknown action: ' + action);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get the active spreadsheet
function getSpreadsheet() {
  // Replace with your actual spreadsheet ID
  const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
  return SpreadsheetApp.openById(spreadsheetId);
}

// User Management Functions
function getUsers() {
  const sheet = getSpreadsheet().getSheetByName('Users');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const users = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const user = {};
    headers.forEach((header, index) => {
      user[header] = row[index];
    });
    users.push(user);
  }
  
  return users;
}

function getStudents() {
  const users = getUsers();
  return users.filter(user => user.role === 'student');
}

function addUser(userData) {
  const sheet = getSpreadsheet().getSheetByName('Users');
  if (!sheet) {
    // Create the sheet if it doesn't exist
    const newSheet = getSpreadsheet().insertSheet('Users');
    newSheet.getRange(1, 1, 1, 8).setValues([['id', 'name', 'email', 'username', 'password', 'role', 'class', 'totalApprovedHours', 'status', 'createdAt']]);
  }
  
  const id = Utilities.getUuid();
  const row = [
    id,
    userData.name,
    userData.email,
    userData.username,
    userData.password,
    userData.role,
    userData.class || '',
    userData.totalApprovedHours || 0,
    userData.status || 'approved',
    new Date().toISOString()
  ];
  
  sheet.appendRow(row);
  return { id, ...userData };
}

function updateUser(userData) {
  const sheet = getSpreadsheet().getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userData.userId) {
      // Update the row
      Object.keys(userData).forEach(key => {
        if (key !== 'userId') {
          const colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            sheet.getRange(i + 1, colIndex + 1).setValue(userData[key]);
          }
        }
      });
      return { success: true };
    }
  }
  
  throw new Error('User not found');
}

function deleteUser(userData) {
  const sheet = getSpreadsheet().getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userData.userId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  throw new Error('User not found');
}

function getUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
}

function getUserById(userId) {
  const users = getUsers();
  return users.find(user => user.id === userId) || null;
}

// Activity Management Functions
function getActivities() {
  const sheet = getSpreadsheet().getSheetByName('Activities');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const activities = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const activity = {};
    headers.forEach((header, index) => {
      activity[header] = row[index];
    });
    activities.push(activity);
  }
  
  return activities;
}

function addActivity(activityData) {
  const sheet = getSpreadsheet().getSheetByName('Activities');
  if (!sheet) {
    const newSheet = getSpreadsheet().insertSheet('Activities');
    newSheet.getRange(1, 1, 1, 5).setValues([['id', 'name', 'description', 'startDate', 'endDate', 'createdAt']]);
  }
  
  const id = Utilities.getUuid();
  const row = [
    id,
    activityData.name,
    activityData.description || '',
    activityData.startDate,
    activityData.endDate,
    new Date().toISOString()
  ];
  
  sheet.appendRow(row);
  return { id, ...activityData };
}

function updateActivity(activityData) {
  const sheet = getSpreadsheet().getSheetByName('Activities');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === activityData.activityId) {
      Object.keys(activityData).forEach(key => {
        if (key !== 'activityId') {
          const colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            sheet.getRange(i + 1, colIndex + 1).setValue(activityData[key]);
          }
        }
      });
      return { success: true };
    }
  }
  
  throw new Error('Activity not found');
}

function deleteActivity(activityData) {
  const sheet = getSpreadsheet().getSheetByName('Activities');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === activityData.activityId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  throw new Error('Activity not found');
}

// Attendance Management Functions
function clockIn(data) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  if (!sheet) {
    const newSheet = getSpreadsheet().insertSheet('Attendance');
    newSheet.getRange(1, 1, 1, 8).setValues([['id', 'userId', 'activityId', 'clockInTime', 'clockOutTime', 'duration', 'status', 'createdAt']]);
  }
  
  const id = Utilities.getUuid();
  const row = [
    id,
    data.userId,
    data.activityId,
    new Date().toISOString(),
    '', // clockOutTime
    '', // duration
    'pending',
    new Date().toISOString()
  ];
  
  sheet.appendRow(row);
  return { id };
}

function clockOut(data) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  const attendanceData = getAttendanceById(data.attendanceId);
  
  if (!attendanceData) {
    throw new Error('Attendance record not found');
  }
  
  const clockOutTime = new Date();
  const clockInTime = new Date(attendanceData.clockInTime);
  const duration = (clockOutTime - clockInTime) / (1000 * 60 * 60); // hours
  
  const dataRange = sheet.getDataRange().getValues();
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.attendanceId) {
      sheet.getRange(i + 1, 5).setValue(clockOutTime.toISOString()); // clockOutTime
      sheet.getRange(i + 1, 6).setValue(duration); // duration
      break;
    }
  }
  
  return { success: true };
}

function getAttendanceByActivity(activityId) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const attendance = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === activityId) { // activityId column
      const row = data[i];
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      
      // Get user data
      const user = getUserById(record.userId);
      if (user) {
        record.user = user;
      }
      
      attendance.push(record);
    }
  }
  
  return attendance;
}

function getUserAttendance(userId) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const attendance = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === userId) { // userId column
      const row = data[i];
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      
      // Get activity data
      const activity = getActivityById(record.activityId);
      if (activity) {
        record.activity = activity;
      }
      
      attendance.push(record);
    }
  }
  
  return attendance;
}

function approveAttendance(data) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  const attendanceData = getAttendanceById(data.attendanceId);
  
  if (!attendanceData) {
    throw new Error('Attendance record not found');
  }
  
  // Update attendance status
  const dataRange = sheet.getDataRange().getValues();
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.attendanceId) {
      sheet.getRange(i + 1, 7).setValue('approved'); // status
      break;
    }
  }
  
  // Update user's total approved hours
  const user = getUserById(attendanceData.userId);
  if (user) {
    const newHours = (user.totalApprovedHours || 0) + (attendanceData.duration || 0);
    updateUser({
      userId: user.id,
      totalApprovedHours: newHours
    });
  }
  
  return { success: true };
}

function rejectAttendance(data) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.attendanceId) {
      sheet.getRange(i + 1, 7).setValue('rejected'); // status
      return { success: true };
    }
  }
  
  throw new Error('Attendance record not found');
}

function isUserClockedIn(userId) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  if (!sheet) return { isClockedIn: false };
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === userId && !data[i][4]) { // userId and no clockOutTime
      return {
        isClockedIn: true,
        attendanceId: data[i][0],
        data: {
          userId: data[i][1],
          activityId: data[i][2],
          clockInTime: data[i][3]
        }
      };
    }
  }
  
  return { isClockedIn: false };
}

// Helper functions
function getAttendanceById(attendanceId) {
  const sheet = getSpreadsheet().getSheetByName('Attendance');
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === attendanceId) {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = data[i][index];
      });
      return record;
    }
  }
  
  return null;
}

function getActivityById(activityId) {
  const activities = getActivities();
  return activities.find(activity => activity.id === activityId) || null;
}

// Signup Requests Functions
function getSignupRequests() {
  const sheet = getSpreadsheet().getSheetByName('SignupRequests');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const requests = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const request = {};
    headers.forEach((header, index) => {
      request[header] = row[index];
    });
    requests.push(request);
  }
  
  return requests;
}

function addSignupRequest(requestData) {
  const sheet = getSpreadsheet().getSheetByName('SignupRequests');
  if (!sheet) {
    const newSheet = getSpreadsheet().insertSheet('SignupRequests');
    newSheet.getRange(1, 1, 1, 8).setValues([['id', 'name', 'email', 'username', 'password', 'class', 'role', 'status', 'createdAt']]);
  }
  
  const id = Utilities.getUuid();
  const row = [
    id,
    requestData.name,
    requestData.email,
    requestData.username,
    requestData.password,
    requestData.class,
    requestData.role,
    'pending',
    new Date().toISOString()
  ];
  
  sheet.appendRow(row);
  return { id, ...requestData };
}

function approveSignupRequest(data) {
  const sheet = getSpreadsheet().getSheetByName('SignupRequests');
  const requestData = getSignupRequestById(data.requestId);
  
  if (!requestData) {
    throw new Error('Signup request not found');
  }
  
  // Add user to Users sheet
  addUser({
    name: requestData.name,
    email: requestData.email,
    username: requestData.username,
    password: requestData.password,
    class: requestData.class,
    role: requestData.role,
    status: 'approved'
  });
  
  // Delete from SignupRequests
  const dataRange = sheet.getDataRange().getValues();
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.requestId) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  
  return { success: true };
}

function rejectSignupRequest(data) {
  const sheet = getSpreadsheet().getSheetByName('SignupRequests');
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.requestId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  throw new Error('Signup request not found');
}

function getSignupRequestById(requestId) {
  const sheet = getSpreadsheet().getSheetByName('SignupRequests');
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === requestId) {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = data[i][index];
      });
      return record;
    }
  }
  
  return null;
}

// Export and Search Functions
function getExportData(classFilter) {
  const students = getStudents();
  let filteredStudents = students;
  
  if (classFilter) {
    filteredStudents = students.filter(student => student.class === classFilter);
  }
  
  return filteredStudents.map(student => ({
    Name: student.name,
    Email: student.email,
    Class: student.class,
    'Total Approved Hours': student.totalApprovedHours || 0,
    'Date Created': student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'
  }));
}

function searchUsers(searchTerm) {
  const students = getStudents();
  const term = searchTerm.toLowerCase();
  
  return students.filter(student => 
    student.name.toLowerCase().includes(term) ||
    student.email.toLowerCase().includes(term) ||
    student.class.toLowerCase().includes(term)
  );
} 