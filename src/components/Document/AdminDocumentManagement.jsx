import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { DollarSign, Share2, TestTube } from 'lucide-react';

const AdminDocumentManagement = ({ onUploadSalarySlip, onTestFormData }) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Admin Document Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Upload Salary Slip</h4>
            <p className="text-sm text-gray-600">Upload salary slips for employees by month and year</p>
            <Button onClick={onUploadSalarySlip}>
              <DollarSign className="w-4 h-4 mr-2" />
              Upload Salary Slip
            </Button>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Share Documents</h4>
            <p className="text-sm text-gray-600">Share documents with multiple employees</p>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Documents
            </Button>
          </div>
          {onTestFormData && (
            <div className="space-y-4">
              <h4 className="font-medium">Test FormData</h4>
              <p className="text-sm text-gray-600">Test FormData construction and API call</p>
              <Button variant="outline" onClick={onTestFormData}>
                <TestTube className="w-4 h-4 mr-2" />
                Test FormData
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdminDocumentManagement;
