import React from 'react';
import { Card, Button, Badge } from '../../components/ui';
import {
  Edit,
  Eye,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CreditCard,
  Building2,
  IdCard,
  Briefcase
} from 'lucide-react';

const UserTable = ({ 
  users, 
  loading, 
  onEdit, 
  onView, 
  onDelete, 
  onToggleStatus,
  viewMode = 'table' // 'table' or 'grid'
}) => {
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

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{user.employee_id}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(user)}
                  className="p-1"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                  className="p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.phone || 'N/A'}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.department?.name || 'N/A'}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <IdCard className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">ID: {user.biometric_id || 'N/A'}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.work_location || 'N/A'}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formatSalary(user.salary)}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{maskAccountNumber(user.bank_account_number)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                {getEmploymentStatusBadge(user.employment_status)}
                <Badge variant={user.is_active ? 'success' : 'danger'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payroll
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.employee_id}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <IdCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">ID: {user.biometric_id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{user.department?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{user.work_location || 'N/A'}</span>
                    </div>
                    {getEmploymentStatusBadge(user.employment_status)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{formatSalary(user.salary)}</span>
                    </div>
                    <div className="text-sm text-gray-500">{user.pay_grade || 'N/A'}</div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{maskAccountNumber(user.bank_account_number)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={user.is_active ? 'success' : 'danger'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(user)}
                      className="p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      className="p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(user)}
                      className="p-1"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UserTable;
