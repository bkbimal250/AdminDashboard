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
  X,
  Briefcase,
  DollarSign,
  CreditCard,
  Building2,
  IdCard,
  Clock
} from 'lucide-react';

const UserView = ({ user, onClose, onEdit }) => {
  const getEmploymentStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Active' },
      'on_leave': { color: 'warning', text: 'On Leave' },
      resigned: { color: 'danger', text: 'Resigned' },
      terminated: { color: 'danger', text: 'Terminated' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <Badge variant={config.color}>{config.text}</Badge>;
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary);
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return 'N/A';
    return `****${accountNumber.slice(-4)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
        <div className="flex space-x-2">
          {onEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(user)}
            >
              Edit User
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Information */}
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-500">{user.employee_id}</p>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Employment Details</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <IdCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Biometric ID: {user.biometric_id || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.department?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.work_location || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Important Dates</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Joining Date: {formatDate(user.joining_date)}</span>
              </div>
              {user.date_of_birth && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Date of Birth: {formatDate(user.date_of_birth)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Payroll & Status */}
        <div className="space-y-6">
          {/* Employment Status */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Employment Status</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <div>
                  {getEmploymentStatusBadge(user.employment_status)}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <Badge variant={user.is_active ? 'success' : 'danger'}>
                  {user.is_active ? 'Active Account' : 'Inactive Account'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Payroll Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Payroll Details</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Salary: {formatSalary(user.salary)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Pay Grade: {user.pay_grade || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Bank Details</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Account: {maskAccountNumber(user.bank_account_number)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">IFSC: {user.ifsc_code || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Branch: {user.bank_branch || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          {user.address && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Address</h4>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600">{user.address}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
        {onEdit && (
          <Button
            variant="primary"
            onClick={() => onEdit(user)}
          >
            Edit User
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UserView;
