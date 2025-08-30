import React from 'react';
import { Card, Button, Badge } from '../../components/ui';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Shield,
  Save,
  X,
  Briefcase,
  DollarSign,
  CreditCard,
  Building2,
  IdCard
} from 'lucide-react';

const UserForm = ({ 
  user, 
  departments, 
  loading, 
  onSubmit, 
  onCancel, 
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = React.useState({
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

  React.useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        department: user.department?.id || '',
        role: user.role || 'employee',
        is_active: user.is_active !== undefined ? user.is_active : true,
        employment_status: user.employment_status || 'active',
        biometric_id: user.biometric_id || '',
        work_location: user.work_location || '',
        salary: user.salary || '',
        pay_grade: user.pay_grade || '',
        bank_account_number: user.bank_account_number || '',
        ifsc_code: user.ifsc_code || '',
        bank_branch: user.bank_branch || ''
      });
    }
  }, [user, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === 'create' ? 'Create New User' : 'Edit User'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter username"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter email address"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              disabled={loading}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              disabled={loading}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter phone number"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <div className="relative">
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select Department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <div className="relative">
                <select
                  value={formData.employment_status}
                  onChange={(e) => handleChange('employment_status', e.target.value)}
                  disabled={loading}
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
                  value={formData.biometric_id}
                  onChange={(e) => handleChange('biometric_id', e.target.value)}
                  disabled={loading}
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
                  value={formData.work_location}
                  onChange={(e) => handleChange('work_location', e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter work location"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
                <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payroll Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  disabled={loading}
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
                value={formData.pay_grade}
                onChange={(e) => handleChange('pay_grade', e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter pay grade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.bank_account_number}
                  onChange={(e) => handleChange('bank_account_number', e.target.value)}
                  disabled={loading}
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
                  value={formData.ifsc_code}
                  onChange={(e) => handleChange('ifsc_code', e.target.value)}
                  disabled={loading}
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
                  value={formData.bank_branch}
                  onChange={(e) => handleChange('bank_branch', e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter bank branch"
                />
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Active Account
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
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
            <span>{loading ? 'Saving...' : (mode === 'create' ? 'Create User' : 'Update User')}</span>
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserForm;
