import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UsersIcon, 
  Clock, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Bell, 
  BarChart3,
  Monitor,
  UserCog,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: Clock,
      show: true
    },
    {
      name: 'Leaves',
      href: '/leaves',
      icon: Calendar,
      show: true
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      show: true
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageSquare,
      show: true
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      show: true
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UsersIcon,
      show: true
    },
    // Admin-only items
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      show: user?.is_superuser
    },
    {
      name: 'User Management',
      href: '/users',
      icon: UsersIcon,
      show: user?.is_superuser
    },
    {
      name: 'Devices',
      href: '/devices',
      icon: Monitor,
      show: user?.is_superuser
    }
  ];

  const filteredItems = navigationItems.filter(item => item.show);

  return (
    <div className={`bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transition-all duration-300 h-full ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Attendance</span>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  active
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:transform hover:scale-105'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                {!isCollapsed && <span className="transition-colors duration-200">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center shadow-md">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.is_superuser ? 'Administrator' : user?.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
