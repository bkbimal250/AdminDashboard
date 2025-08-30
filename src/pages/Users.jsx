import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui';
import { UserTable, UserForm, UserView } from '../components/UserManagement';
import {
  Users as UsersIcon,
  Search,
  Filter,
  Plus,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MapPin,
  DollarSign,
  CreditCard,
  Building2,
  IdCard,
  Grid3X3,
  List
} from 'lucide-react';
import { usersAPI } from '../services/api';

const Users = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    department: '',
    role: 'employee',
    is_active: true,
    employment_status: 'active',
    biometric_id: '',
    work_location: '',
    salary: '',
    pay_grade: '',
    bank_account_number: '',
    ifsc_code: '',
    bank_branch: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Users: Starting to fetch users data...');
      
      const response = await usersAPI.getUsers();
      console.log('📊 Users: API Response Received:');
      console.log('👥 Users API Response:', {
        data: response.data,
        status: response.status,
        headers: response.headers,
        count: Array.isArray(response.data) ? response.data.length : 'Not an array'
      });
      
      const usersData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.results || response.data?.data || [];
      
      console.log('👥 Users: Processed users data:', {
        original: response.data,
        processed: usersData,
        totalRecords: usersData.length,
        roleBreakdown: usersData.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {}),
        departmentBreakdown: usersData.reduce((acc, user) => {
          const deptName = user.department?.name || 'No Department';
          acc[deptName] = (acc[deptName] || 0) + 1;
          return acc;
        }, {}),
        activeUsers: usersData.filter(user => user.is_active).length,
        inactiveUsers: usersData.filter(user => !user.is_active).length
      });
      
      setUsers(usersData);
      console.log('✅ Users: All data processed and state updated successfully');
    } catch (error) {
      console.error('❌ Users: Error fetching users:', error);
      console.error('❌ Users: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await usersAPI.createUser(userData);
      console.log('✅ User created successfully:', response.data);
      setShowAddModal(false);
      setNewUser({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        department: '',
        role: 'employee',
        is_active: true,
        employment_status: 'active',
        biometric_id: '',
        work_location: '',
        salary: '',
        pay_grade: '',
        bank_account_number: '',
        ifsc_code: '',
        bank_branch: ''
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Error creating user:', error);
      alert(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await usersAPI.updateUser(selectedUser.id, userData);
      console.log('✅ User updated successfully:', response.data);
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    try {
      setLoading(true);
      await usersAPI.deleteUser(user.id);
      console.log('✅ User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      setLoading(true);
      const response = await usersAPI.updateUser(user.id, {
        ...user,
        is_active: !user.is_active
      });
      console.log('✅ User status updated successfully:', response.data);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      alert(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === 'all' || 
      user.department?.name === selectedDepartment;

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Get unique departments for filter
  const departments = [...new Set(users.map(user => user.department?.name).filter(Boolean))];

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all system users and their permissions</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center space-x-1"
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center space-x-1"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Grid</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table/Grid */}
      {loading ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </Card>
      ) : (
        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleEditUser}
          onView={handleViewUser}
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleUserStatus}
          viewMode={viewMode}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm
              user={null}
              departments={departments.map(name => ({ id: name, name }))}
              loading={loading}
              onSubmit={handleCreateUser}
              onCancel={() => setShowAddModal(false)}
              mode="create"
            />
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm
              user={selectedUser}
              departments={departments.map(name => ({ id: name, name }))}
              loading={loading}
              onSubmit={handleUpdateUser}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              mode="edit"
            />
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <UserView
              user={selectedUser}
              onClose={() => {
                setShowViewModal(false);
                setSelectedUser(null);
              }}
              onEdit={handleEditUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
