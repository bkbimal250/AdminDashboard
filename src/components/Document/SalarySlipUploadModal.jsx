import React from 'react';
import Button from '../ui/Button';
import { Upload, X } from 'lucide-react';

const SalarySlipUploadModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedUser,
  setSelectedUser,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  allUsers
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload Salary Slip</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee *</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Employee</option>
              {allUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} - {user.employee_id}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month *</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(2024, month - 1).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salary Slip File *</label>
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload Salary Slip
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>

        
      </div>
    </div>
  );
};

export default SalarySlipUploadModal;
