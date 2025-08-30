import React from 'react';
import { Button } from '../ui';
import { Download, FileText, Printer } from 'lucide-react';

const ReportExport = ({ onExport, format = 'csv', loading = false, disabled = false }) => {
  const handleExport = () => {
    if (onExport) {
      onExport(format);
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'csv':
        return Download;
      case 'pdf':
        return FileText;
      case 'print':
        return Printer;
      default:
        return Download;
    }
  };

  const getFormatLabel = (format) => {
    switch (format) {
      case 'csv':
        return 'Export CSV';
      case 'pdf':
        return 'Export PDF';
      case 'print':
        return 'Print Report';
      default:
        return 'Export';
    }
  };

  const Icon = getFormatIcon(format);

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={loading || disabled}
      className="flex items-center space-x-2"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span>{loading ? 'Exporting...' : getFormatLabel(format)}</span>
    </Button>
  );
};

export default ReportExport;
