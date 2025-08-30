import React from 'react';
import { Sun, Clock3, CalendarDays, Activity, Shield } from 'lucide-react';

const WelcomeSection = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                Welcome back, {user?.first_name || user?.username || 'User'}!
              </h1>
              <p className="text-white/80 text-lg font-medium">
                {getGreeting()} • Here's what's happening today
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <Clock3 className="w-5 h-5 text-white/80 flex-shrink-0" />
              <span className="text-white font-semibold">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <CalendarDays className="w-5 h-5 text-white/80 flex-shrink-0" />
              <span className="text-white font-semibold">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex lg:ml-8 space-x-6">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/90 text-sm font-semibold">System Active</p>
            <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-2 animate-pulse"></div>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/90 text-sm font-semibold">Secure</p>
            <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
