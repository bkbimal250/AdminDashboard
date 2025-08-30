import React from 'react';
import { Card, Badge } from '../ui';
import { Users, Clock, TrendingUp, TrendingDown, Eye } from 'lucide-react';

const ReportTable = ({ data, type, loading }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'absent':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  if (loading) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </Card>
    );
  }

  if (!data || !data.users_summary) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No report data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {type.charAt(0).toUpperCase() + type.slice(1)} Report Details
        </h2>
        <Badge className="bg-blue-100 text-blue-800">
          <Users className="w-4 h-4 mr-1" />
          {data.users_summary.length} Employee(s)
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Present Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Absent Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Work Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.users_summary.map((userSummary, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {userSummary.user?.employee_id || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {userSummary.user?.first_name && userSummary.user?.last_name 
                          ? `${userSummary.user.first_name} ${userSummary.user.last_name}`
                          : userSummary.user?.username || 'N/A'
                        }
                      </div>
                      <div className="text-xs text-gray-400">
                        {userSummary.user?.department?.name || 'No Department'}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                    {userSummary.present_days} / {userSummary.total_days}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                    {userSummary.absent_days}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${userSummary.attendance_rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{userSummary.attendance_rate}%</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-500 mr-2" />
                    {userSummary.total_work_time}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-orange-500 mr-2" />
                    {userSummary.total_overtime}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStatusColor(userSummary.attendance_rate >= 80 ? 'active' : 'inactive')}>
                    {userSummary.attendance_rate >= 80 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.users_summary.reduce((acc, user) => acc + user.present_days, 0)}
            </div>
            <div className="text-gray-600">Total Present Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {data.users_summary.reduce((acc, user) => acc + user.absent_days, 0)}
            </div>
            <div className="text-gray-600">Total Absent Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(data.users_summary.reduce((acc, user) => acc + user.attendance_rate, 0) / data.users_summary.length)}%
            </div>
            <div className="text-gray-600">Average Attendance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {data.users_summary.filter(user => user.attendance_rate >= 80).length}
            </div>
            <div className="text-gray-600">Good Performers</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReportTable;
