import React from 'react';
import Badge from '../ui/Badge';

const RecentNotifications = ({ notifications }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19C4.74 3.63 5.5 3.25 6.33 3.25C7.16 3.25 7.92 3.63 8.47 4.19L19.81 15.53C20.37 16.08 20.75 16.84 20.75 17.67C20.75 18.5 20.37 19.26 19.81 19.81C19.26 20.37 18.5 20.75 17.67 20.75C16.84 20.75 16.08 20.37 15.53 19.81L4.19 8.47C3.63 7.92 3.25 7.16 3.25 6.33C3.25 5.5 3.63 4.74 4.19 4.19Z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Recent Notifications</h3>
      </div>
      
      <div className="space-y-4">
        {notifications.slice(0, 5).map((notification, index) => (
          <div key={index} className="group relative flex items-start space-x-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all duration-300">
            <div className="flex-shrink-0">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                !notification.is_read ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
              }`}></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {notification.message || 'System notification'}
                </p>
                {!notification.is_read && (
                  <Badge variant="danger" size="sm" className="ml-2 flex-shrink-0">New</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {new Date(notification.created_at || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNotifications;
