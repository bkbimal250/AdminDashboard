import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Upload, X } from 'lucide-react';

const UploadModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  documentTypes,
  title = "Upload Document"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document Title *</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter document title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select
              value={formData.document_type}
              onChange={(e) => setFormData({...formData, document_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="personal">Personal</option>
              <option value="company">Company</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File *</label>
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
              className="mr-2"
            />
            <label className="text-sm">Make this document public</label>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload
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

export default UploadModal;
