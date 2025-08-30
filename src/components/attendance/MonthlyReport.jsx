import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../ui';
import { 
  Download, Calendar, Clock, User, 
  TrendingUp, BarChart3, FileText, 
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

const MonthlyReport = ({ employee, month, year, attendanceData }) => {
  const [monthlyStats, setMonthlyStats] = useState({});
  const [dailyBreakdown, setDailyBreakdown] = useState([]);

  useEffect(() => {
    calculateMonthlyStats();
  }, [employee, month, year, attendanceData]);

  const calculateMonthlyStats = () => {
    if (!employee || !attendanceData) return;

    const employeeData = attendanceData.filter(record => record.user?.id === employee.id);
    
    // Calculate daily breakdown
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const breakdown = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayData = employeeData.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getDate() === day;
      });

      const checkIn = dayData.find(record => record.status === 'IN');
      const checkOut = dayData.find(record => record.status === 'OUT');
      
      let status = 'absent';
      let workHours = 0;
      
      if (checkIn && checkOut) {
        status = 'present';
        workHours = (new Date(checkOut.timestamp) - new Date(checkIn.timestamp)) / (1000 * 60 * 60);
      } else if (checkIn) {
        status = 'partial';
      }

      breakdown.push({
        date,
        day,
        status,
        checkIn: checkIn?.timestamp,
        checkOut: checkOut?.timestamp,
        workHours: Math.round(workHours * 100) / 100
      });
    }

    // Calculate monthly statistics
    const presentDays = breakdown.filter(day => day.status === 'present').length;
    const partialDays = breakdown.filter(day => day.status === 'partial').length;
    const absentDays = breakdown.filter(day => day.status === 'absent').length;
    const totalWorkHours = breakdown.reduce((sum, day) => sum + day.workHours, 0);
    const averageWorkHours = presentDays > 0 ? totalWorkHours / presentDays : 0;

    setMonthlyStats({
      totalDays: daysInMonth,
      presentDays,
      partialDays,
      absentDays,
      attendanceRate: (presentDays / daysInMonth) * 100,
      totalWorkHours,
      averageWorkHours
    });

    setDailyBreakdown(breakdown);
  };

  const exportMonthlyReport = () => {
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
    const csvContent = [
      ['Employee Monthly Attendance Report'],
      [''],
      ['Employee Name', employee.username],
      ['Employee ID', employee.employee_id || 'N/A'],
      ['Department', employee.department?.name || 'N/A'],
      ['Month', `${monthName} ${year}`],
      [''],
      ['Date', 'Day', 'Status', 'Check In', 'Check Out', 'Work Hours'],
      ...dailyBreakdown.map(day => [
        day.date.toLocaleDateString(),
        day.date.toLocaleDateString('en-US', { weekday: 'short' }),
        day.status.toUpperCase(),
        day.checkIn ? new Date(day.checkIn).toLocaleTimeString() : 'N/A',
        day.checkOut ? new Date(day.checkOut).toLocaleTimeString() : 'N/A',
        day.workHours > 0 ? `${day.workHours}h` : 'N/A'
      ]),
      [''],
      ['Summary'],
      ['Total Days', monthlyStats.totalDays],
      ['Present Days', monthlyStats.presentDays],
      ['Partial Days', monthlyStats.partialDays],
      ['Absent Days', monthlyStats.absentDays],
      ['Attendance Rate', `${Math.round(monthlyStats.attendanceRate)}%`],
      ['Total Work Hours', `${Math.round(monthlyStats.totalWorkHours)}h`],
      ['Average Work Hours', `${Math.round(monthlyStats.averageWorkHours)}h`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${employee.username}_${monthName}_${year}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4" />;
      case 'absent':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (!employee) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Monthly Report</h3>
          <p className="text-gray-600">
            {employee.username} • {new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button onClick={exportMonthlyReport} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-blue-900">
                {Math.round(monthlyStats.attendanceRate || 0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-600">Present Days</p>
              <p className="text-2xl font-bold text-green-900">
                {monthlyStats.presentDays || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-orange-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-orange-600">Total Hours</p>
              <p className="text-2xl font-bold text-orange-900">
                {Math.round(monthlyStats.totalWorkHours || 0)}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Hours/Day</p>
              <p className="text-2xl font-bold text-purple-900">
                {Math.round(monthlyStats.averageWorkHours || 0)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Daily Breakdown</h4>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {dailyBreakdown.map((day, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg border text-center cursor-pointer hover:shadow-sm transition-shadow ${
                day.status === 'present' ? 'bg-green-50 border-green-200' :
                day.status === 'partial' ? 'bg-yellow-50 border-yellow-200' :
                'bg-gray-50 border-gray-200'
              }`}
              title={`${day.date.toLocaleDateString()}: ${day.status}`}
            >
              <div className="text-sm font-medium text-gray-900">{day.day}</div>
              <div className="text-xs text-gray-500 mb-1">
                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="flex justify-center mt-1">
                {getStatusIcon(day.status)}
              </div>
              {day.workHours > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {day.workHours}h
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Table */}
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Summary</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Present Days</td>
                <td className="px-4 py-2 text-sm font-medium text-green-600">{monthlyStats.presentDays || 0}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {Math.round(((monthlyStats.presentDays || 0) / (monthlyStats.totalDays || 1)) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Partial Days</td>
                <td className="px-4 py-2 text-sm font-medium text-yellow-600">{monthlyStats.partialDays || 0}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {Math.round(((monthlyStats.partialDays || 0) / (monthlyStats.totalDays || 1)) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Absent Days</td>
                <td className="px-4 py-2 text-sm font-medium text-red-600">{monthlyStats.absentDays || 0}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {Math.round(((monthlyStats.absentDays || 0) / (monthlyStats.totalDays || 1)) * 100)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default MonthlyReport;
