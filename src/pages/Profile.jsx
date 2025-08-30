import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui';
import { ProfileForm, ProfileSidebar } from '../components/Profile';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  IdCard,
  Briefcase,
  MapPin as LocationIcon,
  DollarSign,
  CreditCard,
  Building2
} from 'lucide-react';
import { usersAPI } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    joining_date: '',
    employment_status: '',
    biometric_id: '',
    work_location: '',
    salary: '',
    pay_grade: '',
    bank_account_number: '',
    ifsc_code: '',
    bank_branch: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || '',
        joining_date: user.joining_date || '',
        employment_status: user.employment_status || '',
        biometric_id: user.biometric_id || '',
        work_location: user.work_location || '',
        salary: user.salary || '',
        pay_grade: user.pay_grade || '',
        bank_account_number: user.bank_account_number || '',
        ifsc_code: user.ifsc_code || '',
        bank_branch: user.bank_branch || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Clean the data before sending - convert empty strings to null for optional fields
      const cleanedData = { ...profileData };
      
      // Convert empty strings to null for optional fields
      const optionalFields = [
        'phone', 'address', 'date_of_birth', 'joining_date', 'biometric_id', 
        'work_location', 'pay_grade', 'bank_account_number', 'ifsc_code', 'bank_branch'
      ];
      
      optionalFields.forEach(field => {
        if (cleanedData[field] === '') {
          cleanedData[field] = null;
        }
      });
      
      // Handle salary field specifically (should be null if empty, not empty string)
      if (cleanedData.salary === '' || cleanedData.salary === null) {
        cleanedData.salary = null;
      } else {
        // Convert to number if it's a string
        cleanedData.salary = parseFloat(cleanedData.salary) || null;
      }
      
      console.log('📤 Sending profile data:', cleanedData);
      const response = await usersAPI.updateProfile(cleanedData);
      console.log('✅ Profile updated successfully:', response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Update local user data
      if (response.data) {
        // You might want to update the auth context here
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await usersAPI.changePassword(passwordData);
      console.log('✅ Password changed successfully:', response.data);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setIsChangingPassword(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('❌ Error changing password:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {message.text && (
        <Card className={`mb-6 p-4 ${
          message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProfileSidebar user={user} />
        </div>

         {/* Main Content */}
         <div className="lg:col-span-2 space-y-6">
           {/* Profile Form */}
           <ProfileForm
             user={user}
             profileData={profileData}
             setProfileData={setProfileData}
             isEditing={isEditing}
             loading={loading}
             onSubmit={handleProfileUpdate}
             onCancel={() => setIsEditing(false)}
             onEdit={() => setIsEditing(true)}
             isAdmin={user.role === 'admin'} // Only admins can edit all fields
           />

          {/* Password Change Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              <Button
                variant={isChangingPassword ? "outline" : "primary"}
                size="sm"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                disabled={loading}
              >
                <Key className="w-4 h-4 mr-2" />
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </Button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        disabled={loading}
                        required
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        disabled={loading}
                        required
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        disabled={loading}
                        required
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                      <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Changing...' : 'Change Password'}</span>
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Account Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
