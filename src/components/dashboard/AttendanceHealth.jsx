import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar
} from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import { attendanceAPI } from '../../services/api';

const AttendanceHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchHealthData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAttendanceHealth();
      setHealthData(response);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch attendance health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = () => {
    if (!healthData) return 'unknown';
    
    const { anomalies_count, corrections_made } = healthData;
    
    if (anomalies_count === 0) return 'healthy';
    if (anomalies_count <= 5) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  if (loading && !healthData) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading attendance health...</span>
        </div>
      </Card>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance System Health</h3>
            <p className="text-sm text-gray-600">Real-time monitoring and validation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(healthStatus)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(healthStatus)}
              <span className="capitalize">{healthStatus}</span>
            </div>
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealthData}
            disabled={loading}
            className="flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {healthData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Today's Records */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Today's Records</p>
                <p className="text-2xl font-bold text-blue-900">{healthData.today_records}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-2xl font-bold text-green-900">{healthData.active_users}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Anomalies Detected */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Anomalies</p>
                <p className="text-2xl font-bold text-yellow-900">{healthData.anomalies_count}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          {/* Auto Corrections */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Auto Fixes</p>
                <p className="text-2xl font-bold text-purple-900">{healthData.corrections_made}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {healthData && healthData.recent_activity && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {healthData.recent_activity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{activity.message}</span>
                </div>
                <span className="text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      )}
    </Card>
  );
};

export default AttendanceHealth;
