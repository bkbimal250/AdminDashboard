import React from 'react';
import Button from '../ui/Button';
import { Upload, DollarSign } from 'lucide-react';

const DocumentHeader = ({ isAdmin, onUploadDocument, onUploadSalarySlip }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Document Management</h1>
        <p className="text-text-secondary">Upload, organize, and manage your documents</p>
      </div>
      <div className="flex items-center space-x-2">
        {isAdmin && (
          <Button variant="outline" onClick={onUploadSalarySlip}>
            <DollarSign className="w-4 h-4 mr-2" />
            Upload Salary Slip
          </Button>
        )}
        <Button onClick={onUploadDocument}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};

export default DocumentHeader;
