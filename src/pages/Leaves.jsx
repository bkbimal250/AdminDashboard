import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { 
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  FileText,
  User,
  CalendarRange,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreHorizontal,
  CalendarCheck,
  CalendarX,
  Clock3,
  Users,
  BarChart3,
  FilterX,
  Save,
  Loader2
} from 'lucide-react';
import { leavesAPI } from '../services/api';

const Leaves = () => {
  const { user, isAdmin } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [newLeave, setNewLeave] = useState({
    leave_type: 'casual',
    from_date: '',
    to_date: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      console.log('🔄 Leaves: Starting to fetch leaves data...');
      
      const response = await leavesAPI.getLeaves();
      
      console.log('📊 Leaves: API Response Received:', {
        data: response.data,
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 'Not an array'
      });
      
      const leavesData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.results || response.data?.data || [];
      
      console.log('📋 Leaves: Processed leaves data:', {
        totalRecords: leavesData.length,
        statusBreakdown: leavesData.reduce((acc, leave) => {
          acc[leave.status] = (acc[leave.status] || 0) + 1;
          return acc;
        }, {}),
        typeBreakdown: leavesData.reduce((acc, leave) => {
          acc[leave.leave_type] = (acc[leave.leave_type] || 0) + 1;
          return acc;
        }, {})
      });
      
      setLeaves(leavesData);
      console.log('✅ Leaves: All data processed and state updated successfully');
    } catch (error) {
      console.error('❌ Leaves: Error fetching leaves:', error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      console.log('📝 Leaves: Submitting leave request:', newLeave);
      await leavesAPI.createLeave(newLeave);
      setShowNewLeaveModal(false);
      setNewLeave({ leave_type: 'casual', from_date: '', to_date: '', reason: '' });
      fetchLeaves();
      console.log('✅ Leaves: Leave request submitted successfully');
    } catch (error) {
      console.error('❌ Leaves: Error creating leave request:', error);
      alert('Error creating leave request. Please try again.');
    }
  };

  const handleApproveLeave = async (leaveId) => {
    setActionLoading(prev => ({ ...prev, [leaveId]: true }));
    try {
      console.log('✅ Leaves: Approving leave:', leaveId);
      await leavesAPI.approveLeave(leaveId);
      await fetchLeaves();
      console.log('✅ Leaves: Leave approved successfully');
    } catch (error) {
      console.error('❌ Leaves: Error approving leave:', error);
      alert('Error approving leave. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [leaveId]: false }));
    }
  };

  const handleRejectLeave = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    setActionLoading(prev => ({ ...prev, [selectedLeave.id]: true }));
    try {
      console.log('❌ Leaves: Rejecting leave:', selectedLeave.id, 'Reason:', rejectionReason);
      await leavesAPI.rejectLeave(selectedLeave.id, { rejection_reason: rejectionReason });
      setShowRejectModal(false);
      setSelectedLeave(null);
      setRejectionReason('');
      await fetchLeaves();
      console.log('✅ Leaves: Leave rejected successfully');
    } catch (error) {
      console.error('❌ Leaves: Error rejecting leave:', error);
      alert('Error rejecting leave. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedLeave.id]: false }));
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [leaveId]: true }));
    try {
      console.log('🗑️ Leaves: Deleting leave:', leaveId);
      await leavesAPI.deleteLeave(leaveId);
      await fetchLeaves();
      console.log('✅ Leaves: Leave deleted successfully');
    } catch (error) {
      console.error('❌ Leaves: Error deleting leave:', error);
      alert('Error deleting leave. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [leaveId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLeaveTypeDisplay = (type) => {
    const types = {
      'sick': 'Sick Leave',
      'casual': 'Casual Leave',
      'annual': 'Annual Leave',
      'personal': 'Personal Leave',
      'other': 'Other'
    };
    return types[type] || type;
  };

  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case 'sick': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'casual': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'annual': return <CalendarCheck className="w-4 h-4 text-green-500" />;
      case 'personal': return <User className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDaysCount = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
    const matchesType = filterType === 'all' || leave.leave_type === filterType;
    const matchesSearch = 
      leave.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterType('all');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading leave data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-blue-600" />
            {isAdmin() ? 'Leave Management' : 'My Leave Requests'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin() ? 'Manage and approve leave requests from employees' : 'View and manage your leave applications'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchLeaves}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          {!isAdmin() && (
            <Button
              onClick={() => setShowNewLeaveModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Leave Request
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by reason, employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="other">Other</option>
            </select>
            
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterX className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Leaves Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                {isAdmin() && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.length === 0 ? (
                                 <tr>
                   <td colSpan={isAdmin() ? 7 : 6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Calendar className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 text-lg font-medium">No leave requests found</p>
                      <p className="text-gray-400">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {leave.user?.first_name && leave.user?.last_name 
                              ? `${leave.user.first_name} ${leave.user.last_name}`
                              : leave.user?.username || 'Unknown User'
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            {leave.user?.employee_id || 'No ID'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getLeaveTypeIcon(leave.leave_type)}
                        <span className="text-sm text-gray-900">
                          {getLeaveTypeDisplay(leave.leave_type)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(leave.from_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(leave.to_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ({getDaysCount(leave.from_date, leave.to_date)} days)
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={getStatusColor(leave.status)}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(leave.status)}
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </Badge>
                      {leave.rejection_reason && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs">
                          Reason: {leave.rejection_reason}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.created_at).toLocaleDateString()}
                    </td>
                    
                    {isAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {leave.status === 'pending' ? (
                            <>
                              <Button
                                onClick={() => handleApproveLeave(leave.id)}
                                size="sm"
                                variant="success"
                                disabled={actionLoading[leave.id]}
                                className="flex items-center gap-1"
                              >
                                {actionLoading[leave.id] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                                Approve
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedLeave(leave);
                                  setShowRejectModal(true);
                                }}
                                size="sm"
                                variant="danger"
                                disabled={actionLoading[leave.id]}
                                className="flex items-center gap-1"
                              >
                                {actionLoading[leave.id] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                                Reject
                              </Button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              {leave.status === 'approved' && (
                                <Button
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setShowRejectModal(true);
                                  }}
                                  size="sm"
                                  variant="danger"
                                  disabled={actionLoading[leave.id]}
                                  className="flex items-center gap-1"
                                >
                                  {actionLoading[leave.id] ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <X className="w-3 h-3" />
                                  )}
                                  Reject
                                </Button>
                              )}
                              {leave.status === 'rejected' && (
                                <Button
                                  onClick={() => handleApproveLeave(leave.id)}
                                  size="sm"
                                  variant="success"
                                  disabled={actionLoading[leave.id]}
                                  className="flex items-center gap-1"
                                >
                                  {actionLoading[leave.id] ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                  Approve
                                </Button>
                              )}
                            </div>
                          )}
                          
                          <Button
                            onClick={() => handleDeleteLeave(leave.id)}
                            size="sm"
                            variant="outline"
                            disabled={actionLoading[leave.id]}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            {actionLoading[leave.id] ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Leave Request Modal */}
      {showNewLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Leave Request</h3>
              <Button
                onClick={() => setShowNewLeaveModal(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  value={newLeave.leave_type}
                  onChange={(e) => setNewLeave({...newLeave, leave_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <Input
                    type="date"
                    value={newLeave.from_date}
                    onChange={(e) => setNewLeave({...newLeave, from_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={newLeave.to_date}
                    onChange={(e) => setNewLeave({...newLeave, to_date: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowNewLeaveModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Leave Modal */}
      {showRejectModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Leave Request</h3>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedLeave(null);
                  setRejectionReason('');
                }}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Employee:</strong> {selectedLeave.user?.username || 'Unknown'}<br/>
                <strong>Leave Type:</strong> {getLeaveTypeDisplay(selectedLeave.leave_type)}<br/>
                <strong>Date Range:</strong> {new Date(selectedLeave.from_date).toLocaleDateString()} - {new Date(selectedLeave.to_date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedLeave(null);
                  setRejectionReason('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectLeave}
                variant="danger"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reject Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;
