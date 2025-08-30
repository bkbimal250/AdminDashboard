import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ReportsDashboard } from '../components/Reports';
import { AlertCircle } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return <ReportsDashboard />;
};

export default Reports;
