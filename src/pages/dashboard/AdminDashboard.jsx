import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { 
  UsersIcon, Calendar, 
  RefreshCw, UserCheck, UserX,
  Building2, Target, Shield,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { dashboardAPI, leavesAPI, usersAPI, officeAPI, officeAdminAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LeaveRequests from '../../components/dashboard/LeaveRequests';
import OfficeList from '../../components/OfficeManagement/OfficeList';
import OfficeForm from '../../components/OfficeManagement/OfficeForm';
import OfficeAdminList from '../../components/OfficeManagement/OfficeAdminList';
import OfficeAdminForm from '../../components/OfficeManagement/OfficeAdminForm';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoSyncStatus, setAutoSyncStatus] = useState({});
  const [syncLoading, setSyncLoading] = useState(false);
  
  // Office Management State
  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const [showOfficeAdminList, setShowOfficeAdminList] = useState(false);
  const [showOfficeAdminForm, setShowOfficeAdminForm] = useState(false);
  const [editingOfficeAdmin, setEditingOfficeAdmin] = useState(null);
  const [showAllUsers, setShowAllUsers] = useState(false);


  useEffect(() => {
    fetchDashboardData();
    fetchAutoSyncStatus();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchAutoSyncStatus();
      setLastUpdate(new Date());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 AdminDashboard: Starting to fetch dashboard data...');
      
      const [statsRes, usersRes, todayAttendanceRes] = await Promise.all([
        dashboardAPI.getStats(),
        usersAPI.getAdminAllUsers(),
        dashboardAPI.getTodayAttendance()
      ]);
      
      console.log('📊 AdminDashboard: All API Responses Received:');
      console.log('📈 Stats API Response:', {
        data: statsRes.data,
        status: statsRes.status,
        headers: statsRes.headers
      });

      console.log('👥 Users API Response:', {
        data: usersRes.data,
        status: usersRes.status,
        count: Array.isArray(usersRes.data) ? usersRes.data.length : 'Not an array'
      });
      console.log('📱 Today Attendance Response:', {
        data: todayAttendanceRes.data,
        status: todayAttendanceRes.status
      });
      
      // Merge stats with today's attendance data
      const enhancedStats = {
        ...statsRes.data,
        dos_attendance: todayAttendanceRes.data.dos_attendance,
        bootcamp_attendance: todayAttendanceRes.data.bootcamp_attendance,
        amp_attendance: todayAttendanceRes.data.amp_attendance
      };
      
      setStats(enhancedStats);
      setAllUsers(usersRes.data || []);
      
      console.log('✅ AdminDashboard: All data processed and state updated successfully');
      

    } catch (error) {
      console.error('❌ AdminDashboard: Error fetching dashboard data:', error);
      console.error('❌ AdminDashboard: Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      // Set empty arrays as fallback
      setAllUsers([]);
    } finally {
      setLoading(false);
      console.log('🏁 AdminDashboard: Loading completed');
    }
  };

  const fetchAutoSyncStatus = async () => {
    try {
      const response = await dashboardAPI.getAutoSyncStatus();
      setAutoSyncStatus(response.data);
    } catch (error) {
      console.error('Error fetching auto sync status:', error);
    }
  };

  const handleStartAutoSync = async () => {
    try {
      setSyncLoading(true);
      await dashboardAPI.startAutoSync();
      await fetchAutoSyncStatus();
    } catch (error) {
      console.error('Error starting auto sync:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleStopAutoSync = async () => {
    try {
      setSyncLoading(true);
      await dashboardAPI.stopAutoSync();
      await fetchAutoSyncStatus();
    } catch (error) {
      console.error('Error stopping auto sync:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleForceSync = async () => {
    try {
      setSyncLoading(true);
      await dashboardAPI.forceSyncAll();
      await fetchDashboardData();
      await fetchAutoSyncStatus();
    } catch (error) {
      console.error('Error force syncing:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  // Office Management Functions
  const handleCreateOffice = () => {
    setEditingOffice(null);
    setShowOfficeForm(true);
  };

  const handleEditOffice = (office) => {
    setEditingOffice(office);
    setShowOfficeForm(true);
  };

  const handleViewOffice = (office) => {
    // TODO: Implement office detail view
    console.log('View office:', office);
  };

  const handleOfficeFormSuccess = () => {
    setShowOfficeForm(false);
    setEditingOffice(null);
    // Refresh dashboard data if needed
  };

  const handleCreateOfficeAdmin = () => {
    setEditingOfficeAdmin(null);
    setShowOfficeAdminForm(true);
  };

  const handleEditOfficeAdmin = (admin) => {
    setEditingOfficeAdmin(admin);
    setShowOfficeAdminForm(true);
  };

  const handleOfficeAdminFormSuccess = () => {
    setShowOfficeAdminForm(false);
    setEditingOfficeAdmin(null);
    // Refresh admin list if needed
  };



  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const formatPercentage = (value, total) => {
    if (!total || total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
      case 'approved':
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'absent':
      case 'rejected':
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your attendance system</p>
          <p className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchDashboardData} variant="outline" size="sm" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          
          {autoSyncStatus.is_running ? (
            <Button 
              onClick={handleStopAutoSync} 
              variant="destructive" 
              size="sm" 
              className="flex items-center space-x-2"
              disabled={syncLoading}
            >
              <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
              <span>Stop Auto Sync</span>
            </Button>
          ) : (
            <Button 
              onClick={handleStartAutoSync} 
              variant="default" 
              size="sm" 
              className="flex items-center space-x-2"
              disabled={syncLoading}
            >
              <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
              <span>Start Auto Sync</span>
            </Button>
          )}
          
          <Button 
            onClick={handleForceSync} 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2"
            disabled={syncLoading}
          >
            <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
            <span>Force Sync All</span>
          </Button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.total_users || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                All registered users
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.active_users || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Currently active
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber((stats.total_users || 0) - (stats.active_users || 0))}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Currently inactive
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">DOS Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.dos_attendance || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                DOS Office records
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bootcamp Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.bootcamp_attendance || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Bootcamp Office records
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AMP Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.amp_attendance || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                AMP Office records
              </p>
            </div>
            <div className="p-3 rounded-full bg-teal-100">
              <Target className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </Card>


      </div>

      

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">

        {/* All Users Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-indigo-100 text-indigo-800">
                {allUsers.length} users
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllUsers(!showAllUsers)}
                className="flex items-center space-x-2"
              >
                {showAllUsers ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Hide Users</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span>Show Users</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showAllUsers ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-indigo-600">
                              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user.username || 'Unknown'
                              }
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {user.employee_id || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.department?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">{user.role || 'user'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(user.is_active ? 'active' : 'inactive')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.joining_date 
                          ? new Date(user.joining_date).toLocaleDateString()
                          : user.created_at 
                            ? new Date(user.created_at).toLocaleDateString()
                            : 'N/A'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* Office Management Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Office Management</h2>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowOfficeAdminList(!showOfficeAdminList)}
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Manage Admins</span>
              </Button>
            </div>
          </div>
          
          <OfficeList 
            onEditOffice={handleEditOffice}
            onViewOffice={handleViewOffice}
            onCreateOffice={handleCreateOffice}
          />
        </Card>

        {/* Office Admin Management */}
        {showOfficeAdminList && (
          <Card className="p-6">
            <OfficeAdminList 
              onEditAdmin={handleEditOfficeAdmin}
              onCreateAdmin={handleCreateOfficeAdmin}
            />
          </Card>
        )}
      </div>

      {/* Office Form Modal */}
      <OfficeForm 
        office={editingOffice}
        isOpen={showOfficeForm}
        onClose={() => setShowOfficeForm(false)}
        onSuccess={handleOfficeFormSuccess}
      />

      {/* Office Admin Form Modal */}
      <OfficeAdminForm 
        admin={editingOfficeAdmin}
        isOpen={showOfficeAdminForm}
        onClose={() => setShowOfficeAdminForm(false)}
        onSuccess={handleOfficeAdminFormSuccess}
      />

    </div>
  );
};

export default AdminDashboard;
