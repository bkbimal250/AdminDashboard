import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { 
  Menu, 
  Bell, 
  Search, 
  User,
  Settings,
  LogOut
} from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between max-w-full">
        {/* Left side */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 flex-shrink-0 transition-all duration-200 hover:scale-105"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Notifications */}
          <button className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 group">
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm animate-pulse"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.first_name || user?.username || 'User'} {user?.last_name || ''}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.is_superuser ? 'Administrator' : user?.role || 'User'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200/50 py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
                >
                  <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                  Profile
                </button>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
                >
                  <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                  Settings
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-500 group-hover:text-red-600" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
