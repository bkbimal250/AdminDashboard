import React from 'react';
import { Card, Button, Badge } from '../../components/ui';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Briefcase,
  DollarSign,
  CreditCard,
  Building2,
  IdCard
} from 'lucide-react';

const ProfileForm = ({ 
  user, 
  profileData, 
  setProfileData, 
  isEditing, 
  loading, 
  onSubmit, 
  onCancel,
  onEdit, // New prop for handling edit mode
  isAdmin = false // If true, allows editing of all fields
}) => {
  const getEmploymentStatusColor = (status) => {
    const statusColors = {
      active: 'success',
      'on_leave': 'warning',
      resigned: 'danger',
      terminated: 'danger'
    };
    return statusColors[status] || 'secondary';
  };

  const getEmploymentStatusDisplay = (status) => {
    const statusDisplay = {
      active: 'Active',
      'on_leave': 'On Leave',
      resigned: 'Resigned',
      terminated: 'Terminated'
    };
    return statusDisplay[status] || status;
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFieldEditable = (fieldName) => {
    // Admin can edit all fields
    if (isAdmin) return true;
    
    // Regular users can only edit basic profile fields
    const editableFields = [
      'first_name', 'last_name', 'phone', 'address', 
      'date_of_birth'
    ];
    
    return editableFields.includes(fieldName);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        <div className="flex space-x-2">
          {!isEditing && (
            <Button
              variant="primary"
              size="sm"
              onClick={onEdit}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onSubmit}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <form className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profileData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              disabled={!isEditing || loading || !isFieldEditable('first_name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              disabled={!isEditing || loading || !isFieldEditable('last_name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={profileData.email}
                disabled={true} // Email is never editable
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                placeholder="Enter email address"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing || loading || !isFieldEditable('phone')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter phone number"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={profileData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                disabled={!isEditing || loading || !isFieldEditable('date_of_birth')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Joining Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={profileData.joining_date}
                disabled={true} // Joining date is never editable
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Employment Information - Only editable by admin */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <div className="relative">
                <select
                  value={profileData.employment_status}
                  onChange={(e) => handleChange('employment_status', e.target.value)}
                  disabled={!isEditing || loading || !isFieldEditable('employment_status')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="resigned">Resigned</option>
                  <option value="terminated">Terminated</option>
                </select>
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biometric ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.biometric_id}
                  onChange={(e) => handleChange('biometric_id', e.target.value)}
                  disabled={!isEditing || loading || !isFieldEditable('biometric_id')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter biometric ID"
                />
                <IdCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.work_location}
                  onChange={(e) => handleChange('work_location', e.target.value)}
                  disabled={!isEditing || loading || !isFieldEditable('work_location')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter work location"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={profileData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  disabled={!isEditing || loading || !isFieldEditable('salary')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter salary amount"
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Grade
              </label>
              <input
                type="text"
                value={profileData.pay_grade}
                onChange={(e) => handleChange('pay_grade', e.target.value)}
                disabled={!isEditing || loading || !isFieldEditable('pay_grade')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter pay grade"
              />
            </div>
          </div>
        </div>

        {/* Bank Information - Only editable by admin */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.bank_account_number}
                  onChange={(e) => handleChange('bank_account_number', e.target.value)}
                  disabled={!isEditing || loading || !isFieldEditable('bank_account_number')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter bank account number"
                />
                <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.ifsc_code}
                  onChange={(e) => handleChange('ifsc_code', e.target.value)}
                  disabled={!isEditing || loading || !isFieldEditable('ifsc_code')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter IFSC code"
                />
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Branch
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.bank_branch}
                  onChange={(e) => handleChange('bank_branch', e.target.value)}
                  disabled={!isEditing || loading || !isFieldEditable('bank_branch')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter bank branch"
                />
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={profileData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={!isEditing || loading || !isFieldEditable('address')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter address"
            />
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;
