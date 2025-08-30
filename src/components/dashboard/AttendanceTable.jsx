import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  User, 
  Calendar, 
  Clock, 
  Eye,
  LogIn,
  LogOut,
  Timer,
  Zap
} from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import { formatISTTime, formatWorkTime } from '../../utils/timeUtils';

const AttendanceTable = ({ attendanceData }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    console.log('🔍 AttendanceTable: Received attendanceData:', attendanceData);
    
    // Handle different possible data structures
    let dataArray = [];
    
    if (attendanceData?.data && Array.isArray(attendanceData.data)) {
      console.log('✅ AttendanceTable: Found data array with', attendanceData.data.length, 'records');
      dataArray = attendanceData.data;
    } else if (Array.isArray(attendanceData)) {
      console.log('✅ AttendanceTable: attendanceData is already an array with', attendanceData.length, 'records');
      dataArray = attendanceData;
    } else if (attendanceData?.results && Array.isArray(attendanceData.results)) {
      console.log('✅ AttendanceTable: Found results array with', attendanceData.results.length, 'records');
      dataArray = attendanceData.results;
    } else {
      console.log('❌ AttendanceTable: No valid data found in attendanceData:', attendanceData);
      setFilteredData([]);
      return;
    }

    let filtered = [...dataArray];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user?.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.device_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(record => record.status === filterStatus);
    }

    // Apply date filter
    if (filterDate) {
      const filterDateStr = new Date(filterDate).toISOString().split('T')[0];
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
        return recordDate === filterDateStr;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'timestamp':
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
        case 'user':
          aValue = `${a.user?.first_name || ''} ${a.user?.last_name || ''}`.toLowerCase();
          bValue = `${b.user?.first_name || ''} ${b.user?.last_name || ''}`.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'device_id':
          aValue = a.device_id || '';
          bValue = b.device_id || '';
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log('✅ AttendanceTable: Setting filtered data with', filtered.length, 'records');
    setFilteredData(filtered);
  }, [attendanceData, searchTerm, filterStatus, filterDate, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN':
        return 'bg-green-100 text-green-800';
      case 'OUT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superuser':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportAttendance = () => {
    const csvContent = [
      ['Employee Name', 'Employee ID', 'Department', 'Date', 'Time (IST)', 'Status', 'Device ID', 'Location'],
      ...filteredData.map(record => [
        `${record.user?.first_name || ''} ${record.user?.last_name || ''}`.trim() || record.user?.username || 'N/A',
        record.user?.employee_id || 'N/A',
        record.user?.department?.name || 'N/A',
        formatISTTime(record.timestamp, 'date'),
        formatISTTime(record.timestamp, 'time'),
        record.status,
        record.device_id || 'N/A',
        record.location || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return formatISTTime(timestamp, 'datetime');
  };

  return (
    <div className="space-y-4">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Showing {filteredData.length} of {attendanceData?.count || attendanceData?.data?.length || 0} records
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportAttendance}
            className="flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, employee ID, or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="IN">Clock In</option>
                <option value="OUT">Clock Out</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterStatus('');
                  setFilterDate('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('user')}
              >
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Employee</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Time (IST)</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <Timer className="w-4 h-4" />
                  <span>Status</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('device_id')}
              >
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Device</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {record.user?.first_name && record.user?.last_name 
                          ? `${record.user.first_name} ${record.user.last_name}`
                          : record.user?.username || 'N/A'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.user?.employee_id || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {record.user?.department?.name || 'No Department'}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatISTTime(record.timestamp, 'date')}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatISTTime(record.timestamp, 'time')}
                  </div>
                  <div className="text-xs text-gray-500">IST</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.status === 'IN' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {record.status === 'IN' ? (
                        <LogIn className="w-4 h-4 text-green-600" />
                      ) : (
                        <LogOut className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status === 'IN' ? 'Clock In' : 'Clock Out'}
                    </Badge>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">{record.device_id || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{record.location || 'No location'}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(record.user);
                      setShowUserModal(true);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No attendance records found</p>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Employee ID:</span>
                <span className="text-sm text-gray-900">{selectedUser.employee_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="text-sm text-gray-900">
                  {selectedUser.first_name && selectedUser.last_name 
                    ? `${selectedUser.first_name} ${selectedUser.last_name}`
                    : selectedUser.username || 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <span className="text-sm text-gray-900">{selectedUser.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Department:</span>
                <span className="text-sm text-gray-900">{selectedUser.department?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Role:</span>
                <Badge className={getRoleColor(selectedUser.role)}>
                  {selectedUser.role || 'User'}
                </Badge>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
