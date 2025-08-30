import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import Login from './pages/Login';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Users from './pages/Users';

import Devices from './pages/Devices';
import Settings from './pages/Settings';

// Import layout
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, authenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.is_superuser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Component
const AppContent = () => {
  const { user, authenticated } = useAuth();

  if (!authenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/dashboard" 
          element={
            user?.is_superuser ? <AdminDashboard /> : <UserDashboard />
          } 
        />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Admin-only routes */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute adminOnly>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/devices" 
          element={
            <ProtectedRoute adminOnly>
              <Devices />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

// App Component with Providers
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
