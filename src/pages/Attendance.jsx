import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { 
  Clock, Calendar, Download, Filter, 
  Search, RefreshCw, TrendingUp, Users,
  UserCheck, UserX, BarChart3, FileText
} from 'lucide-react';
import { attendanceAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AttendanceStats from '../components/attendance/AttendanceStats';
import AttendanceTable from '../components/attendance/AttendanceTable';
import EmployeeSearch from '../components/attendance/EmployeeSearch';
import MonthlyReport from '../components/attendance/MonthlyReport';

const Attendance = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);
  const [noRecordsFound, setNoRecordsFound] = useState(false);

  // Check if user has permission to view all records
  const canViewAllRecords = user?.role === 'superuser' || user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, selectedEmployee]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoRecordsFound(false);
      console.log('🔄 Attendance: Starting to fetch data...');
      console.log('📅 Attendance: Fetching for month:', selectedMonth, 'year:', selectedYear);
      
      const [attendanceRes, usersRes] = await Promise.all([
        attendanceAPI.getAttendance(selectedMonth, selectedYear),
        usersAPI.getUsers()
      ]);

      console.log('📊 Attendance: API Responses:');
      console.log('⏰ Attendance Response:', {
        data: attendanceRes.data,
        status: attendanceRes.status,
        count: Array.isArray(attendanceRes.data) ? attendanceRes.data.length : 'Not an array'
      });
      console.log('👥 Users Response:', {
        data: usersRes.data,
        status: usersRes.status,
        count: Array.isArray(usersRes.data) ? usersRes.data.length : 'Not an array'
      });

      // Process attendance data - handle paginated response
      let attendanceArray = [];
      if (Array.isArray(attendanceRes.data)) {
        attendanceArray = attendanceRes.data;
      } else if (attendanceRes.data?.results) {
        // Handle paginated response
        attendanceArray = attendanceRes.data.results;
        console.log('📊 Attendance: Paginated response -', {
          total: attendanceRes.data.count,
          currentPage: attendanceRes.data.results.length,
          hasNext: !!attendanceRes.data.next,
          hasPrevious: !!attendanceRes.data.previous
        });
      } else if (attendanceRes.data?.data) {
        attendanceArray = attendanceRes.data.data;
      }
      
      // Process users data
      const usersArray = Array.isArray(usersRes.data) 
        ? usersRes.data 
        : usersRes.data?.results || usersRes.data?.data || [];

      setAttendanceData(attendanceArray);
      setUsersData(usersArray);

      // Check if no records found
      if (attendanceArray.length === 0) {
        setNoRecordsFound(true);
        setFilteredData([]);
        setStats({
          totalRecords: 0,
          todayRecords: 0,
          checkIns: 0,
          checkOuts: 0,
          presentEmployees: 0,
          totalEmployees: usersArray.length
        });
      } else {
        // Filter data based on selected employee
        filterData(attendanceArray, selectedMonth, selectedYear, selectedEmployee);
      }

    } catch (error) {
      console.error('❌ Attendance: Error fetching data:', error);
      setError(error.message || 'Failed to fetch attendance data');
      setAttendanceData([]);
      setUsersData([]);
      setFilteredData([]);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data, month, year, employee) => {
    console.log('🔍 Attendance: Filtering data with:', { month, year, employee });
    
    let filtered = [...data];

    // Filter by selected employee
    if (employee) {
      filtered = filtered.filter(record => record.user?.id === employee.id);
    }

    // Filter by user role (if not admin/superuser/manager, show only own records)
    if (!canViewAllRecords) {
      filtered = filtered.filter(record => record.user?.id === user?.id);
    }

    console.log('✅ Attendance: Filtered data:', {
      originalCount: data.length,
      filteredCount: filtered.length,
      month,
      year,
      employee: employee?.username || 'All'
    });

    setFilteredData(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (data) => {
    const today = new Date().toDateString();
    const todayRecords = data.filter(record => 
      new Date(record.timestamp).toDateString() === today
    );

    const stats = {
      totalRecords: data.length,
      todayRecords: todayRecords.length,
      checkIns: data.filter(record => record.status === 'IN').length,
      checkOuts: data.filter(record => record.status === 'OUT').length,
      presentEmployees: new Set(data.filter(record => record.status === 'IN').map(record => record.user?.id)).size,
      totalEmployees: usersData.length
    };

    console.log('📈 Attendance: Calculated stats:', stats);
    setStats(stats);
  };

  const handleEmployeeSelect = (employee) => {
    console.log('👤 Attendance: Employee selected:', employee);
    setSelectedEmployee(employee);
  };

  const handleMonthChange = (month) => {
    console.log('📅 Attendance: Month changed to:', month);
    setSelectedMonth(month);
  };

  const handleYearChange = (year) => {
    console.log('📅 Attendance: Year changed to:', year);
    setSelectedYear(year);
  };

  const clearFilters = () => {
    setSelectedEmployee(null);
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">
            {canViewAllRecords 
              ? 'View and manage all attendance records' 
              : 'View your attendance records'
            }
          </p>
          {!canViewAllRecords && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ You can only view your own attendance records
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <Button onClick={fetchData} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <AttendanceStats stats={stats} />

      {/* Employee Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Search */}
        <div className="lg:col-span-1">
          <EmployeeSearch 
            users={usersData}
            selectedEmployee={selectedEmployee}
            onEmployeeSelect={handleEmployeeSelect}
            canViewAll={canViewAllRecords}
            currentUser={user}
          />
        </div>

        {/* Month/Year Filter */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter by Month</h3>
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>January</option>
                  <option value={1}>February</option>
                  <option value={2}>March</option>
                  <option value={3}>April</option>
                  <option value={4}>May</option>
                  <option value={5}>June</option>
                  <option value={6}>July</option>
                  <option value={7}>August</option>
                  <option value={8}>September</option>
                  <option value={9}>October</option>
                  <option value={10}>November</option>
                  <option value={11}>December</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current Filter:</strong> {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                {selectedEmployee && ` • Employee: ${selectedEmployee.username}`}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Monthly Report */}
      {selectedEmployee && (
        <MonthlyReport 
          employee={selectedEmployee}
          month={selectedMonth}
          year={selectedYear}
          attendanceData={filteredData}
        />
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-semibold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* No Records Found Message */}
      {noRecordsFound && !loading && !error && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-semibold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-yellow-800">No Records Found</h3>
              <p className="text-yellow-700">
                No attendance records found for {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                {selectedEmployee && ` for ${selectedEmployee.username}`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Attendance Table */}
      {!error && !noRecordsFound && (
        <AttendanceTable 
          attendanceData={filteredData}
          loading={loading}
          canViewAll={canViewAllRecords}
          selectedEmployee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default Attendance;
