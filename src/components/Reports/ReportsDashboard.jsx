import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../ui';
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Calendar,
  Activity,
  FileText,
  PieChart,
  LineChart,
  Settings,
  Eye,
  Filter
} from 'lucide-react';
import { attendanceAPI, usersAPI, departmentsAPI, devicesAPI } from '../../services/api';
import ReportFilters from './ReportFilters';
import ReportCard from './ReportCard';
import ReportChart from './ReportChart';
import ReportTable from './ReportTable';
import ReportExport from './ReportExport';

const ReportsDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [realTimeStats, setRealTimeStats] = useState(null);

  useEffect(() => {
    fetchRealTimeStats();
    
    // Set up real-time updates every 60 seconds
    const interval = setInterval(() => {
      fetchRealTimeStats();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeStats = async () => {
    try {
      const response = await attendanceAPI.getRealTimeStats();
      setRealTimeStats(response.data);
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    }
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
      const response = await attendanceAPI.getAdminAllUsersSummary(selectedYear, selectedMonth);
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const exportReport = async (format = 'csv') => {
    try {
      setGenerating(true);
      const response = await attendanceAPI.exportAdminAllUsersReport(selectedYear, selectedMonth);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', description: 'Comprehensive attendance analysis' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl"></div>
        <Card className="relative border-0 shadow-xl bg-white/90 backdrop-blur-sm" hover>
          <Card.Body className="p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Reports Dashboard
                    </h1>
                    <p className="text-gray-600 font-medium">Generate comprehensive attendance reports and analytics</p>
                  </div>
                </div>
                {realTimeStats && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(realTimeStats.last_updated).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="secondary"
                  onClick={fetchRealTimeStats}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={generateReport}
                  disabled={generating}
                  className="flex items-center justify-center space-x-2"
                >
                  {generating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>{generating ? 'Generating...' : 'Generate Report'}</span>
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Real-time Statistics */}
      {realTimeStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title="Total Users"
            value={realTimeStats.total_users || 0}
            icon={Users}
            color="blue"
            trend={realTimeStats.user_growth || 0}
            trendLabel="vs last month"
          />
          <ReportCard
            title="Active Today"
            value={realTimeStats.active_today || 0}
            icon={Activity}
            color="green"
            trend={realTimeStats.attendance_rate || 0}
            trendLabel="attendance rate"
          />
          <ReportCard
            title="Total Devices"
            value={realTimeStats.total_devices || 0}
            icon={Activity}
            color="purple"
            trend={realTimeStats.connected_devices || 0}
            trendLabel="connected"
          />
          <ReportCard
            title="Total Work Hours"
            value={`${realTimeStats.total_work_hours || 0}h`}
            icon={Clock}
            color="orange"
            trend={realTimeStats.overtime_hours || 0}
            trendLabel="overtime hours"
          />
        </div>
      )}

      {/* Report Type Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {reportTypes.map((type) => {
            const Icon = Clock;
            const color = 'blue';
            const isSelected = true;
            
            return (
              <div
                key={type.id}
                className={`p-4 border-2 rounded-lg ${`border-${color}-500 bg-${color}-50`}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${`bg-${color}-100`}`}>
                    <Icon className={`w-6 h-6 ${`text-${color}-600`}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${`text-${color}-900`}`}>
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <ReportFilters
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedDepartment=""
        setSelectedDepartment={() => {}}
        departments={[]}
        reportType="attendance"
      />

      {/* Report Content */}
      {reportData && (
        <div className="space-y-6">
          {/* Report Actions */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Attendance Report
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedMonth}/{selectedYear} • {reportData.total_users_processed || 0} records
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => exportReport('csv')}
                  disabled={generating}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportReport('pdf')}
                  disabled={generating}
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Report Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChart
              data={reportData}
              type="attendance"
              title="Attendance Overview"
            />
            <ReportChart
              data={reportData}
              type="attendance"
              title="Attendance Performance"
            />
          </div>

          {/* Report Table */}
          <ReportTable
            data={reportData}
            type="attendance"
            loading={loading}
          />
        </div>
      )}

      {/* Empty State */}
      {!reportData && !loading && (
        <Card className="p-12">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h3>
            <p className="text-gray-600 mb-6">
              Click "Generate Report" to create your attendance report
            </p>
            <Button
              variant="primary"
              onClick={generateReport}
              disabled={generating}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsDashboard;