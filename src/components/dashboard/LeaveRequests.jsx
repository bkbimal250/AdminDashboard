import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  CalendarRange,
  AlertCircle,
  CalendarCheck,
  FileText,
  Loader2,
  Eye,
  Check,
  X
} from 'lucide-react';
import { leavesAPI } from '../../services/api';

const LeaveRequests = ({ pendingLeaves, onLeaveUpdate }) => {
  const [rejectingLeave, setRejectingLeave] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const handleApproveLeave = async (leaveId) => {
    setActionLoading(prev => ({ ...prev, [leaveId]: true }));
    try {
      console.log('✅ LeaveRequests: Approving leave:', leaveId);
      await leavesAPI.approveLeave(leaveId);
      if (onLeaveUpdate) {
        await onLeaveUpdate();
      }
      console.log('✅ LeaveRequests: Leave approved successfully');
    } catch (error) {
      console.error('❌ LeaveRequests: Error approving leave:', error);
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

    setActionLoading(prev => ({ ...prev, [rejectingLeave.id]: true }));
    try {
      console.log('❌ LeaveRequests: Rejecting leave:', rejectingLeave.id, 'Reason:', rejectionReason);
      await leavesAPI.rejectLeave(rejectingLeave.id, { rejection_reason: rejectionReason });
      setRejectingLeave(null);
      setRejectionReason('');
      if (onLeaveUpdate) {
        await onLeaveUpdate();
      }
      console.log('✅ LeaveRequests: Leave rejected successfully');
    } catch (error) {
      console.error('❌ LeaveRequests: Error rejecting leave:', error);
      alert('Error rejecting leave. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [rejectingLeave.id]: false }));
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

  if (pendingLeaves.length === 0) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" hover>
        <Card.Header className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pending Leave Requests</h3>
            </div>
            <Badge variant="warning" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              0 Pending
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-semibold mb-2">No pending leave requests</p>
            <p className="text-gray-500 text-sm">All leave requests have been processed</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" hover>
        <Card.Header className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pending Leave Requests</h3>
            </div>
            <Badge variant="warning" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pendingLeaves.length} Pending
            </Badge>
          </div>
        </Card.Header>
        
        <Card.Body className="p-6">
          <div className="space-y-4">
            {pendingLeaves.map((leave) => (
              <div key={leave.id} className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {leave.user?.first_name && leave.user?.last_name 
                            ? `${leave.user.first_name} ${leave.user.last_name}`
                            : leave.user?.username || 'Unknown User'
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          {leave.user?.employee_id || 'No ID'} • {leave.user?.department?.name || 'No Department'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-16 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                          {getLeaveTypeIcon(leave.leave_type)}
                          <span className="text-sm font-semibold text-gray-700">
                            {getLeaveTypeDisplay(leave.leave_type)}
                          </span>
                        </div>
                        <Badge variant="warning" className="text-xs">
                          {getDaysCount(leave.from_date, leave.to_date)} days
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">From: {new Date(leave.from_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">To: {new Date(leave.to_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">Reason:</span> {leave.reason}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 font-medium">
                        Applied on {new Date(leave.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3 ml-6">
                    <Button
                      onClick={() => handleApproveLeave(leave.id)}
                      size="md"
                      variant="success"
                      disabled={actionLoading[leave.id]}
                      className="flex items-center gap-2 w-full"
                    >
                      {actionLoading[leave.id] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Approve
                    </Button>
                    
                    <Button
                      onClick={() => setRejectingLeave(leave)}
                      size="md"
                      variant="danger"
                      disabled={actionLoading[leave.id]}
                      className="flex items-center gap-2 w-full"
                    >
                      {actionLoading[leave.id] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Reject Leave Modal */}
      {rejectingLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Leave Request</h3>
              <Button
                onClick={() => {
                  setRejectingLeave(null);
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
                <strong>Employee:</strong> {rejectingLeave.user?.username || 'Unknown'}<br/>
                <strong>Leave Type:</strong> {getLeaveTypeDisplay(rejectingLeave.leave_type)}<br/>
                <strong>Date Range:</strong> {new Date(rejectingLeave.from_date).toLocaleDateString()} - {new Date(rejectingLeave.to_date).toLocaleDateString()}
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
                  setRejectingLeave(null);
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
    </>
  );
};

export default LeaveRequests;
