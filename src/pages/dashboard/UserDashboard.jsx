import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { 
  Clock, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  LogIn,
  LogOut,
  Download,
  Eye,
  CalendarDays,
  Clock3,
  User,
  Building,
  Target,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  RefreshCw,
  Timer,
  Zap,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Download as DownloadIcon
} from 'lucide-react';
import { attendanceAPI, leavesAPI, notificationsAPI } from '../../services/api';
import { formatISTTime, formatWorkTime, getCurrentIST } from '../../utils/timeUtils';

const UserDashboard = () => {
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(getCurrentIST());
  
  // Filter states
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedMonth, setSelectedMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  useEffect(() => {
    fetchUserData();
    
    // Set up periodic updates
    const interval = setInterval(() => {
      fetchUserData();
      setLastUpdate(getCurrentIST());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allAttendance, dateRange, selectedMonth]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('🔄 UserDashboard: Starting to fetch user data...');
      console.log('👤 Current User:', {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        role: user?.role
      });
      
      // Fetch all data in parallel
      const [statusRes, attendanceRes, leavesRes, notificationsRes, monthlyRes] = await Promise.all([
        attendanceAPI.getTodayStatus(),
        attendanceAPI.getAttendance(),
        leavesAPI.getLeaves(),
        notificationsAPI.getNotifications(),
        attendanceAPI.getMonthlySummary(selectedMonth.year, selectedMonth.month)
      ]);
      
      console.log('📊 UserDashboard: All API Responses Received:');
      console.log('⏰ Today Status API Response:', {
        data: statusRes.data,
        status: statusRes.status,
        headers: statusRes.headers
      });
      console.log('📅 Attendance API Response:', {
        data: attendanceRes.data,
        status: attendanceRes.status,
        count: Array.isArray(attendanceRes.data) ? attendanceRes.data.length : 'Not an array'
      });
      console.log('📋 Leaves API Response:', {
        data: leavesRes.data,
        status: leavesRes.status,
        count: Array.isArray(leavesRes.data) ? leavesRes.data.length : 'Not an array'
      });
      console.log('🔔 Notifications API Response:', {
        data: notificationsRes.data,
        status: notificationsRes.status,
        count: Array.isArray(notificationsRes.data) ? notificationsRes.data.length : 'Not an array'
      });
      console.log('📈 Monthly Summary API Response:', {
        data: monthlyRes.data,
        status: monthlyRes.status,
        year: selectedMonth.year,
        month: selectedMonth.month
      });
      
      setTodayStatus(statusRes.data);
      
      // Handle attendance data
      const attendanceData = Array.isArray(attendanceRes.data) 
        ? attendanceRes.data 
        : attendanceRes.data?.results || attendanceRes.data?.data || [];
      console.log('⏰ UserDashboard: Processed attendance data:', {
        original: attendanceRes.data,
        processed: attendanceData,
        totalRecords: attendanceData.length
      });
      
      setAllAttendance(attendanceData);
      const recentAttendance = attendanceData.slice(0, 5);
      setRecentAttendance(recentAttendance);
      
      // Handle leaves data
      const leavesData = Array.isArray(leavesRes.data) 
        ? leavesRes.data 
        : leavesRes.data?.results || leavesRes.data?.data || [];
      const pendingLeaves = leavesData.filter(leave => leave.status === 'pending');
      console.log('📋 UserDashboard: Processed leaves data:', {
        original: leavesRes.data,
        processed: leavesData,
        pendingLeaves: pendingLeaves
      });
      setPendingLeaves(pendingLeaves);
      
      // Handle notifications data
      const notificationsData = Array.isArray(notificationsRes.data) 
        ? notificationsRes.data 
        : notificationsRes.data?.results || notificationsRes.data?.data || [];
      const recentNotifications = notificationsData.slice(0, 5);
      console.log('🔔 UserDashboard: Processed notifications data:', {
        original: notificationsRes.data,
        processed: notificationsData,
        recentNotifications: recentNotifications
      });
      setNotifications(recentNotifications);
      
      // Handle monthly summary data
      console.log('📈 UserDashboard: Monthly summary data:', monthlyRes.data);
      setMonthlySummary(monthlyRes.data);
      
    } catch (error) {
      console.error('❌ UserDashboard: Error fetching user data:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allAttendance];
    
    // Apply date range filter
    if (dateRange.startDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        const startDate = new Date(dateRange.startDate);
        return recordDate >= startDate;
      });
    }
    
    if (dateRange.endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59); // Include the entire end date
        return recordDate <= endDate;
      });
    }
    
    console.log('🔍 UserDashboard: Applied filters:', {
      totalRecords: allAttendance.length,
      filteredRecords: filtered.length,
      dateRange,
      selectedMonth
    });
    
    setFilteredAttendance(filtered);
  };

  const fetchMonthlySummary = async (year, month) => {
    try {
      console.log('📈 UserDashboard: Fetching monthly summary for:', { year, month });
      const response = await attendanceAPI.getMonthlySummary(year, month);
      console.log('📈 UserDashboard: Monthly summary response:', response.data);
      setMonthlySummary(response.data);
    } catch (error) {
      console.error('❌ UserDashboard: Error fetching monthly summary:', error);
    }
  };

  const handleMonthChange = (direction) => {
    const newMonth = { ...selectedMonth };
    if (direction === 'next') {
      if (newMonth.month === 12) {
        newMonth.month = 1;
        newMonth.year += 1;
      } else {
        newMonth.month += 1;
      }
    } else {
      if (newMonth.month === 1) {
        newMonth.month = 12;
        newMonth.year -= 1;
      } else {
        newMonth.month -= 1;
      }
    }
    setSelectedMonth(newMonth);
    fetchMonthlySummary(newMonth.year, newMonth.month);
  };

  const exportMonthlyReport = async () => {
    try {
      console.log('📥 UserDashboard: Exporting monthly report for:', selectedMonth);
      const response = await attendanceAPI.exportMonthlyReport(selectedMonth.year, selectedMonth.month);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_report_${user?.username}_${selectedMonth.year}_${selectedMonth.month.toString().padStart(2, '0')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ UserDashboard: Monthly report exported successfully');
    } catch (error) {
      console.error('❌ UserDashboard: Error exporting monthly report:', error);
    }
  };

  const getAttendanceStatus = (record) => {
    // Determine attendance status based on the record
    if (record.status === 'IN') {
      return {
        status: 'Present',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        description: 'Clock In'
      };
    } else if (record.status === 'OUT') {
      return {
        status: 'Present',
        color: 'bg-blue-100 text-blue-800',
        icon: <LogOut className="w-4 h-4 text-blue-600" />,
        description: 'Clock Out'
      };
    }
    return {
      status: 'Unknown',
      color: 'bg-gray-100 text-gray-800',
      icon: <Activity className="w-4 h-4 text-gray-600" />,
      description: 'Unknown'
    };
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
      case 'active':
      case 'approved':
      case 'in':
        return 'bg-green-100 text-green-800';
      case 'absent':
      case 'inactive':
      case 'rejected':
      case 'out':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
      case 'active':
      case 'in':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'absent':
      case 'inactive':
      case 'out':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      default:
        return <Activity className="w-6 h-6 text-gray-600" />;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return formatISTTime(timeString, 'time');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatISTTime(dateString, 'date');
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const calculateAttendanceStats = () => {
    // Group records by date to count unique days
    const recordsByDate = {};
    
    filteredAttendance.forEach(record => {
      const date = record.timestamp.split('T')[0]; // Get date part only
      if (!recordsByDate[date]) {
        recordsByDate[date] = [];
      }
      recordsByDate[date].push(record);
    });
    
    // Count present days (days with at least one IN record)
    const presentDays = Object.values(recordsByDate).filter(dayRecords => 
      dayRecords.some(record => record.status === 'IN')
    ).length;
    
    const totalDays = Object.keys(recordsByDate).length;
    const rate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    
    console.log('📊 UserDashboard: Attendance stats calculation:', {
      recordsByDate,
      presentDays,
      totalDays,
      rate
    });
    
    return {
      present: presentDays,
      absent: totalDays - presentDays,
      total: totalDays,
      rate
    };
  };

  const attendanceStats = calculateAttendanceStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name && user?.last_name 
              ? `${user.first_name} ${user.last_name}` 
              : user?.username || 'User'}!
          </h1>
          <p className="text-gray-600">Here's your attendance overview</p>
          <p className="text-sm text-gray-500">Last updated: {formatISTTime(lastUpdate, 'time')} IST</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <Button onClick={fetchUserData} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Attendance Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setDateRange({ startDate: '', endDate: '' })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStatus?.status || 'Not Available'}
              </p>
            </div>
            <div className={`p-2 rounded-full ${getStatusColor(todayStatus?.status || 'unknown')}`}>
              {getStatusIcon(todayStatus?.status || 'unknown')}
            </div>
          </div>
          <div className="mt-4">
            <Badge className={getStatusColor(todayStatus?.status || 'unknown')}>
              {todayStatus?.status === 'present' ? 'Present Today' : 
               todayStatus?.status === 'absent' ? 'Absent Today' : 'Status Unknown'}
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clock In</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStatus?.clock_in_time || 'Not Clocked In'}
              </p>
            </div>
            <div className="p-2 rounded-full bg-green-100">
              <LogIn className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {todayStatus?.clock_in ? `Device: ${todayStatus.clock_in.device_id || 'N/A'}` : 'No clock in record'}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clock Out</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStatus?.clock_out_time || 'Not Clocked Out'}
              </p>
            </div>
            <div className="p-2 rounded-full bg-red-100">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {todayStatus?.clock_out ? `Device: ${todayStatus.clock_out.device_id || 'N/A'}` : 'No clock out record'}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Work Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStatus?.total_work_time || '0h 0m'}
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-100">
              <Timer className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {todayStatus?.total_overtime && todayStatus.total_overtime !== '0h 0m' 
                ? `Overtime: ${todayStatus.total_overtime}` 
                : 'Standard 9-hour day'}
            </p>
          </div>
        </Card>
      </div>

      {/* Monthly Summary Section */}
      {monthlySummary && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Attendance Summary</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => handleMonthChange('prev')}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium">
                  {monthlySummary.month_name} {monthlySummary.year}
                </span>
                <Button 
                  onClick={() => handleMonthChange('next')}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={exportMonthlyReport}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{monthlySummary.total_days}</div>
              <p className="text-sm text-gray-600">Total Days</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{monthlySummary.present_days}</div>
              <p className="text-sm text-gray-600">Present Days</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{monthlySummary.absent_days}</div>
              <p className="text-sm text-gray-600">Absent Days</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{monthlySummary.complete_days}</div>
              <p className="text-sm text-gray-600">Complete Days</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{monthlySummary.attendance_rate}%</div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{monthlySummary.total_work_time}</div>
              <p className="text-sm text-gray-600">Total Work Time</p>
            </div>
          </div>

          {/* Daily Summary Table */}
          {monthlySummary.daily_summaries && monthlySummary.daily_summaries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Clock In</th>
                    <th className="px-4 py-2 text-left">Clock Out</th>
                    <th className="px-4 py-2 text-left">Work Time</th>
                    <th className="px-4 py-2 text-left">Overtime</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlySummary.daily_summaries.map((day, index) => (
                    <tr key={index} className={day.is_present ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2">
                        <div>
                          <div className="font-medium">
                            {new Date(day.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {day.clock_in_time || 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        {day.clock_out_time || 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        {day.total_work_time}
                      </td>
                      <td className="px-4 py-2">
                        {day.total_overtime}
                      </td>
                      <td className="px-4 py-2">
                        <Badge className={day.is_present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {day.is_present ? 'Present' : 'Absent'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Filtered Attendance Records */}
      {filteredAttendance.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Filtered Attendance Records</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {filteredAttendance.length} records
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Device</th>
                  <th className="px-4 py-2 text-left">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendance.map((record, index) => {
                  const attendanceStatus = getAttendanceStatus(record);
                  return (
                    <tr key={index} className="bg-white">
                      <td className="px-4 py-2">
                        {formatDate(record.timestamp)}
                      </td>
                      <td className="px-4 py-2">
                        {formatTime(record.timestamp)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          {attendanceStatus.icon}
                          <Badge className={attendanceStatus.color}>
                            {attendanceStatus.description}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {record.device_id || 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        {record.location || 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Work Hours Details */}
      {todayStatus?.work_hours !== undefined && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Work Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {todayStatus.work_hours}h {todayStatus.work_minutes}m
              </div>
              <p className="text-sm text-gray-600">Total Work Time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                7h 30m
              </div>
              <p className="text-sm text-gray-600">Standard Hours</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {todayStatus.overtime_hours}h {todayStatus.overtime_minutes}m
              </div>
              <p className="text-sm text-gray-600">Overtime</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge className={todayStatus.is_complete_day ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {todayStatus.is_complete_day ? 'Complete Day' : 'Incomplete Day'}
            </Badge>
          </div>
        </Card>
      )}

      {/* User Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Employee ID</span>
              <span className="text-sm text-gray-900">{user?.employee_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Full Name</span>
              <span className="text-sm text-gray-900">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.username || 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-sm text-gray-900">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Department</span>
              <span className="text-sm text-gray-900">{user?.department?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Role</span>
              <Badge className={getStatusColor(user?.role || 'user')}>
                {user?.role || 'User'}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Filtered Records</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(filteredAttendance.length)} records
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Unique Days</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(attendanceStats.total)} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Present Days</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(attendanceStats.present)} days
                <span className="text-xs text-gray-500 ml-1">(with Clock IN)</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Absent Days</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(attendanceStats.absent)} days
                <span className="text-xs text-gray-500 ml-1">(no Clock IN)</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
              <span className="text-sm font-semibold text-gray-900">
                {attendanceStats.rate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Pending Leaves</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(pendingLeaves.length)}
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> A day is considered "Present" if the user has at least one Clock IN record for that day. A day is considered "Complete" if the user works 7.5 hours or more.
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Attendance</h2>
            <Badge className="bg-blue-100 text-blue-800">
              <Clock className="w-4 h-4 mr-1" />
              Last 5 Records
            </Badge>
          </div>
          
          {recentAttendance.length > 0 ? (
            <div className="space-y-3">
              {recentAttendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.status === 'IN' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {record.status === 'IN' ? (
                        <LogIn className="w-4 h-4 text-green-600" />
                      ) : (
                        <LogOut className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.status === 'IN' ? 'Clock In' : 'Clock Out'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(record.timestamp)} at {formatTime(record.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatTime(record.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500">IST</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent attendance records</p>
            </div>
          )}
        </Card>

        {/* Recent Notifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
            <Badge className="bg-purple-100 text-purple-800">
              <Bell className="w-4 h-4 mr-1" />
              Last 5
            </Badge>
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.is_read ? 'bg-gray-400' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent notifications</p>
            </div>
          )}
        </Card>
      </div>

      {/* Pending Leaves */}
      {pendingLeaves.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingLeaves.map((leave, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.leave_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.from_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.to_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(leave.status)}>
                        {leave.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;
