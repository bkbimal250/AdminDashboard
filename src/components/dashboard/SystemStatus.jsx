import React from 'react';
import Card from '../ui/Card';

const SystemStatus = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" hover>
        <Card.Header className="border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">System Status</h3>
          </div>
        </Card.Header>
        <Card.Body className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900">Database</span>
              </div>
              <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900">API Server</span>
              </div>
              <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">Running</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900">Authentication</span>
              </div>
              <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-gray-900">Backup</span>
              </div>
              <span className="text-yellow-700 font-bold bg-yellow-100 px-3 py-1 rounded-full text-sm">Pending</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" hover>
        <Card.Header className="border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
          </div>
        </Card.Header>
        <Card.Body className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">CPU Usage</span>
                <span className="text-sm font-bold text-gray-900">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Memory Usage</span>
                <span className="text-sm font-bold text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Disk Space</span>
                <span className="text-sm font-bold text-gray-900">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Network</span>
                <span className="text-sm font-bold text-gray-900">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SystemStatus;
