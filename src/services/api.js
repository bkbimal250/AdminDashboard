import axios from 'axios';
import jwtAuthService from './jwtAuth';

// Create axios instance with better timeout configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = jwtAuthService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Handle paginated responses
    if (response.data && typeof response.data === 'object') {
      if (response.data.results) {
        console.log('📄 API: Detected paginated response with "results", extracting results array');
        response.data = response.data.results;
      }
    }
    
    return response;
  },
  async (error) => {
    console.error('❌ API Response Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🔄 API: Attempting token refresh due to 401 error...');
      // Try to refresh token
      const refreshed = await jwtAuthService.refreshToken();
      if (!refreshed) {
        console.log('❌ API: Token refresh failed, logging out user');
        // Refresh failed, logout user
        jwtAuthService.logout();
      } else {
        console.log('✅ API: Token refresh successful');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials), // JWT login
  register: (userData) => api.post('/auth/register/', userData),
  getToken: (credentials) => api.post('/token/', credentials), // JWT token
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  verifyToken: (token) => api.post('/token/verify/', { token }),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/update_profile/', data),
  changePassword: (passwordData) => api.post('/auth/change_password/', passwordData),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users/'),
  createUser: (userData) => api.post('/users/', userData),
  getUser: (id) => api.get(`/users/${id}/`),
  updateUser: (id, userData) => api.put(`/users/${id}/`, userData),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  getUsersForChat: () => api.get('/users/list_for_chat/'),
  getAdminAllUsers: (params = {}) => api.get('/users/admin_all_users/', { params }),
  updateProfile: (data) => api.put('/users/update_profile/', data),
  changePassword: (passwordData) => api.post('/users/change_password/', passwordData),
  deleteAccount: () => api.delete('/users/delete_account/'),
};

// Departments API
export const departmentsAPI = {
  getDepartments: () => api.get('/departments/'),
  createDepartment: (deptData) => api.post('/departments/', deptData),
  getDepartment: (id) => api.get(`/departments/${id}/`),
  updateDepartment: (id, deptData) => api.put(`/departments/${id}/`, deptData),
  deleteDepartment: (id) => api.delete(`/departments/${id}/`),
};

// Attendance API
export const attendanceAPI = {
  getAttendance: (month = null, year = null) => {
    const params = new URLSearchParams();
    if (month !== null) params.append('month', month);
    if (year !== null) params.append('year', year);
    const queryString = params.toString();
    return api.get(`/attendance/${queryString ? `?${queryString}` : ''}`);
  },
  getTodayStatus: () => api.get('/attendance/today_status/'),
  clockIn: (data) => api.post('/attendance/clock_in/', data),
  clockOut: (data) => api.post('/attendance/clock_out/', data),
  getDailyWorkHours: (date) => api.get(`/attendance/daily_work_hours/?date=${date}`),
  getMonthlySummary: (year, month) => api.get(`/attendance/monthly_summary/?year=${year}&month=${month}`),
  exportMonthlyReport: (year, month) => api.get(`/attendance/export_monthly_report/?year=${year}&month=${month}`, { responseType: 'blob' }),
  
  // Admin endpoints
  getAdminAllUsersSummary: (year, month, userId = null) => {
    const params = new URLSearchParams({ year, month });
    if (userId) params.append('user_id', userId);
    return api.get(`/attendance/admin_all_users_summary/?${params}`);
  },
  exportAdminAllUsersReport: (year, month, userId = null) => {
    const params = new URLSearchParams({ year, month });
    if (userId) params.append('user_id', userId);
    return api.get(`/attendance/admin_export_all_users_report/?${params}`, { responseType: 'blob' });
  },
  
  // New report endpoints
  getRealTimeStats: () => api.get('/attendance/real_time_stats/'),
  getDepartmentSummary: (year, month, departmentId) => api.get(`/attendance/department_summary/?year=${year}&month=${month}&department_id=${departmentId}`),
  exportDepartmentReport: (year, month, departmentId) => api.get(`/attendance/export_department_report/?year=${year}&month=${month}&department_id=${departmentId}`, { responseType: 'blob' }),
  getUserSummary: (year, month) => api.get(`/attendance/user_summary/?year=${year}&month=${month}`),
  exportUserReport: (year, month) => api.get(`/attendance/export_user_report/?year=${year}&month=${month}`, { responseType: 'blob' }),
  
  // Admin overrides and per-user days
  getUserMonthDays: (userId, year, month) => api.get(`/attendance/user_month_days/?user_id=${userId}&year=${year}&month=${month}`),
  setOverride: (payload) => api.post('/attendance/set_override/', payload),
  clearOverride: (payload) => api.post('/attendance/clear_override/', payload),
  // Health monitoring
  getAttendanceHealth: () => api.get('/attendance/health/')
};

// Leaves API
export const leavesAPI = {
  getLeaves: () => api.get('/leaves/'),
  createLeave: (leaveData) => api.post('/leaves/', leaveData),
  getLeave: (id) => api.get(`/leaves/${id}/`),
  updateLeave: (id, leaveData) => api.put(`/leaves/${id}/`, leaveData),
  deleteLeave: (id) => api.delete(`/leaves/${id}/`),
  approveLeave: (id) => api.post(`/leaves/${id}/approve/`),
  rejectLeave: (id, data) => api.post(`/leaves/${id}/reject/`, data),
  updateLeaveStatus: (id, statusData) => api.patch(`/leaves/${id}/`, statusData),
};

// Documents API
export const documentsAPI = {
  getDocuments: () => api.get('/documents/'),
  createDocument: (documentData) => api.post('/documents/', documentData),
  getDocument: (id) => api.get(`/documents/${id}/`),
  updateDocument: (id, documentData) => api.put(`/documents/${id}/`, documentData),
  deleteDocument: (id) => api.delete(`/documents/${id}/`),
  shareDocument: (data) => api.post('/documents/share_document/', data),
  // New endpoints
  getSalarySlips: (userId = null) => {
    const params = userId ? `?user_id=${userId}` : '';
    return api.get(`/documents/salary_slips/${params}`);
  },
  getMyDocuments: () => api.get('/documents/my_documents/'),
  uploadSalarySlip: (data) => api.post('/documents/upload_salary_slip/', data),
  getDocumentsByMonth: (month, year) => api.get(`/documents/?month=${month}&year=${year}`),
  // Salary slip history endpoints
  getSalarySlipHistory: (month = null, year = null, userId = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    if (userId) params.append('user_id', userId);
    const queryString = params.toString();
    return api.get(`/documents/salary_slip_history/${queryString ? `?${queryString}` : ''}`);
  },
  getSalarySlipStats: (month = null, year = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const queryString = params.toString();
    return api.get(`/documents/salary_slip_stats/${queryString ? `?${queryString}` : ''}`);
  },
};

// Chat API
export const chatAPI = {
  getChatRooms: () => api.get('/chat-rooms/'),
  createChatRoom: (roomData) => api.post('/chat-rooms/create_room/', roomData),
  getMessages: () => api.get('/chat-messages/'),
  sendMessage: (messageData) => api.post('/chat-messages/', messageData),
  getRoomMessages: (roomId) => api.get(`/chat-messages/room_messages/?room_id=${roomId}`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications/'),
  getNotification: (id) => api.get(`/notifications/${id}/`),
  getUnreadCount: () => api.get('/notifications/unread_count/'),
  getRecent: () => api.get('/notifications/recent/'),
  getByType: (type) => api.get(`/notifications/by_type/?type=${type}`),
  getByPriority: (priority) => api.get(`/notifications/by_priority/?priority=${priority}`),
  markAsRead: (id) => api.post(`/notifications/${id}/mark_as_read/`),
  markAllAsRead: () => api.post('/notifications/mark_all_as_read/'),
  deleteExpired: () => api.delete('/notifications/delete_expired/'),
};

// Admin Notifications API
export const adminNotificationsAPI = {
  getNotifications: () => api.get('/admin-notifications/'),
  getNotification: (id) => api.get(`/admin-notifications/${id}/`),
  createAnnouncement: (data) => api.post('/admin-notifications/create_announcement/', data),
  createBulkNotification: (data) => api.post('/admin-notifications/create_bulk_notification/', data),
  getStatistics: () => api.get('/admin-notifications/statistics/'),
  updateNotification: (id, data) => api.put(`/admin-notifications/${id}/`, data),
  deleteNotification: (id) => api.delete(`/admin-notifications/${id}/`),
};

// User Activities API
export const activitiesAPI = {
  getActivities: () => api.get('/user-activities/'),
  getActivity: (id) => api.get(`/user-activities/${id}/`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats/'),
  generateReport: (reportData) => api.post('/dashboard/attendance_report/', reportData),
  getTodayAttendance: () => api.get('/dashboard/today_attendance/'),
  startAutoSync: () => api.post('/dashboard/start_auto_sync/'),
  stopAutoSync: () => api.post('/dashboard/stop_auto_sync/'),
  getAutoSyncStatus: () => api.get('/dashboard/auto_sync_status/'),
  forceSyncAll: () => api.post('/dashboard/force_sync_all/'),
};

// Real-time ZKTeco Monitoring API
export const realtimeAPI = {
  startMonitoring: () => api.post('/zkteco-realtime/start_monitoring/'),
  stopMonitoring: () => api.post('/zkteco-realtime/stop_monitoring/'),
  getStatus: () => api.get('/zkteco-realtime/status/'),
  getRecentEntries: () => api.get('/zkteco-realtime/recent_entries/'),
};

// ZKTeco Device Management API
export const zktecoAPI = {
  syncAllDevices: () => api.post('/zkteco-tests/sync_all_devices/'),
  getSyncStatus: () => api.get('/zkteco-tests/sync_status/'),
  getAttendanceSummary: () => api.get('/zkteco-tests/attendance_summary/'),
  testDevice: (deviceId) => api.post(`/device-tests/${deviceId}/test_connection/`),
  syncDevice: (deviceId) => api.post(`/device-tests/${deviceId}/sync_attendance/`),
};

// Device Management API
export const devicesAPI = {
  // Device CRUD operations
  getDevices: () => api.get('/devices/'),
  getDevice: (id) => api.get(`/devices/${id}/`),
  createDevice: (deviceData) => api.post('/devices/', deviceData),
  updateDevice: (id, deviceData) => api.put(`/devices/${id}/`, deviceData),
  deleteDevice: (id) => api.delete(`/devices/${id}/`),

  // Device connection and sync
  testConnection: (id) => api.post(`/devices/${id}/test_connection/`),
  syncUsers: (id) => api.post(`/devices/${id}/sync_users/`),
  syncAttendance: (id) => api.post(`/devices/${id}/sync_attendance/`),
  syncAllDevices: () => api.post('/devices/sync_all/'),

  // Device mappings
  getDeviceMappings: (id) => api.get(`/devices/${id}/mappings/`),
  addDeviceMapping: (id, mappingData) => api.post(`/devices/${id}/mappings/`, mappingData),
  removeDeviceMapping: (mappingId) => api.delete(`/device-mappings/${mappingId}/`),

  // Device logs
  getDeviceLogs: (id) => api.get(`/devices/${id}/logs/`),

  // Device status and health
  getDeviceStatus: (id) => api.get(`/devices/${id}/status/`),
  getDeviceHealth: (id) => api.get(`/devices/${id}/health/`),

  // Real-time data endpoints
  getRealTimeData: (id) => api.get(`/devices/${id}/real_time_data/`),
  getAllRealTimeData: () => api.get('/devices/all_real_time_data/'),

  // Report endpoints
  exportDeviceReport: () => api.get('/devices/export_device_report/', { responseType: 'blob' }),

  // Bulk operations
  bulkSync: (deviceIds) => api.post('/devices/bulk_sync/', { device_ids: deviceIds }),
  bulkTest: (deviceIds) => api.post('/devices/bulk_test/', { device_ids: deviceIds }),
};

// Office API
export const officeAPI = {
  getOffices: () => api.get('/offices/'),
  getOffice: (id) => api.get(`/offices/${id}/`),
  createOffice: (officeData) => api.post('/offices/', officeData),
  updateOffice: (id, officeData) => api.put(`/offices/${id}/`, officeData),
  deleteOffice: (id) => api.delete(`/offices/${id}/`),
  getOfficeStatistics: (id) => api.get(`/offices/${id}/statistics/`),
  getOfficeEmployees: (id) => api.get(`/offices/${id}/employees/`),
};

// Office Admin API
export const officeAdminAPI = {
  getOfficeAdmins: () => api.get('/office-admins/'),
  getOfficeAdmin: (id) => api.get(`/office-admins/${id}/`),
  createOfficeAdmin: (adminData) => api.post('/office-admins/', adminData),
  updateOfficeAdmin: (id, adminData) => api.put(`/office-admins/${id}/`, adminData),
  deleteOfficeAdmin: (id) => api.delete(`/office-admins/${id}/`),
  getMyOfficeAdmins: () => api.get('/office-admins/my_office_admins/'),
};

export default api;
