import React from 'react';
import { Card } from '../ui';
import { BarChart3, PieChart, LineChart } from 'lucide-react';

const ReportChart = ({ data, type, title }) => {
  const getChartIcon = (type) => {
    switch (type) {
      case 'attendance':
        return BarChart3;
      case 'department':
        return PieChart;
      default:
        return LineChart;
    }
  };

  const Icon = getChartIcon(type);

  // Mock chart data - in a real implementation, you'd use a charting library like Chart.js or Recharts
  const renderMockChart = () => {
    if (!data) return null;

    switch (type) {
      case 'attendance':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Present</span>
              <span className="text-sm font-medium text-green-600">
                {data.users_summary?.reduce((acc, user) => acc + user.present_days, 0) || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${data.users_summary?.length ? 
                    (data.users_summary.reduce((acc, user) => acc + user.present_days, 0) / 
                     data.users_summary.reduce((acc, user) => acc + user.total_days, 0)) * 100 : 0}%` 
                }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Absent</span>
              <span className="text-sm font-medium text-red-600">
                {data.users_summary?.reduce((acc, user) => acc + user.absent_days, 0) || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ 
                  width: `${data.users_summary?.length ? 
                    (data.users_summary.reduce((acc, user) => acc + user.absent_days, 0) / 
                     data.users_summary.reduce((acc, user) => acc + user.total_days, 0)) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        );

      case 'department':
        return (
          <div className="space-y-3">
            {data.users_summary?.slice(0, 5).map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">
                  {user.user?.department?.name || 'No Department'}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {user.attendance_rate}%
                </span>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Icon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Chart data not available</p>
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="h-48 flex items-center justify-center">
        {renderMockChart()}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Records: {data?.users_summary?.length || 0}</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default ReportChart;
