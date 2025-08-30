import React from 'react';
import { LogIn, Clock, Calendar, FileText, MessageSquare, Activity } from 'lucide-react';

const RecentActivities = ({ recentActivities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4 text-primary-600" />;
      case 'attendance': return <Clock className="w-4 h-4 text-success-600" />;
      case 'leave': return <Calendar className="w-4 h-4 text-warning-600" />;
      case 'document': return <FileText className="w-4 h-4 text-info-600" />;
      case 'chat': return <MessageSquare className="w-4 h-4 text-brand-600" />;
      default: return <Activity className="w-4 h-4 text-secondary-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
      </div>
      
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={activity.id} className="group relative flex items-start space-x-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all duration-300">
            {/* Activity line */}
            {index < recentActivities.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
            )}
            
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {getActivityIcon(activity.type)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {activity.user}
                </p>
                <span className="text-xs text-gray-500 font-medium">
                  {activity.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
