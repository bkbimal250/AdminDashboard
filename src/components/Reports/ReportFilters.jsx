import React from 'react';
import { Card } from '../ui';
import { Filter, Calendar, RefreshCw } from 'lucide-react';

const ReportFilters = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth
}) => {
  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const resetFilters = () => {
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{getMonthName(month)}</option>
            ))}
          </select>
        </div>
        
        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      {/* Current Selection Display */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-4 text-sm text-blue-800">
          <span>
            <strong>Period:</strong> {getMonthName(selectedMonth)} {selectedYear}
          </span>
          <span>
            <strong>Report Type:</strong> Attendance Report
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ReportFilters;
