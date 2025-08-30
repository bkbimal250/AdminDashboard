import React from 'react';
import Badge from '../ui/Badge';
import { 
  FileText,
  File,
  FileImage,
  DollarSign,
  Briefcase,
  CreditCard,
  Award,
  User,
  Share2
} from 'lucide-react';

const DocumentCard = ({ doc }) => {
  const getFileIcon = (documentType, fileExtension) => {
    switch (documentType) {
      case 'salary_slip':
        return <DollarSign className="w-6 h-6 text-green-600" />;
      case 'offer_letter':
      case 'appointment_letter':
        return <Briefcase className="w-6 h-6 text-blue-600" />;
      case 'aadhaar':
      case 'pan':
      case 'voter_id':
      case 'passport':
      case 'driving_license':
        return <CreditCard className="w-6 h-6 text-purple-600" />;
      case 'certificate':
      case 'experience_certificate':
        return <Award className="w-6 h-6 text-yellow-600" />;
      default:
        switch (fileExtension) {
          case 'pdf': return <FileText className="w-6 h-6 text-red-600" />;
          case 'doc':
          case 'docx': return <FileText className="w-6 h-6 text-blue-600" />;
          case 'jpg':
          case 'jpeg':
          case 'png': return <FileImage className="w-6 h-6 text-purple-600" />;
          default: return <File className="w-6 h-6 text-gray-600" />;
        }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'personal': return <User className="w-4 h-4" />;
      case 'shared': return <Share2 className="w-4 h-4" />;
      case 'company': return <Briefcase className="w-4 h-4" />;
      case 'salary': return <DollarSign className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'shared': return 'bg-green-100 text-green-800';
      case 'company': return 'bg-purple-100 text-purple-800';
      case 'salary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        {getFileIcon(doc.document_type, doc.file_extension)}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{doc.title}</h4>
          {doc.description && (
            <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
          )}
          {doc.salary_period && (
            <p className="text-xs text-green-600 font-medium">{doc.salary_period}</p>
          )}
          {doc.shared_by && (
            <p className="text-xs text-blue-600">Shared by: {doc.shared_by.username}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <Badge className={getCategoryColor(doc.category)}>
              {getCategoryIcon(doc.category)}
              <span className="ml-1">
                {doc.category === 'salary' ? 'Salary' : 
                 doc.category === 'shared' ? 'Shared' : 
                 doc.category === 'company' ? 'Company' : 
                 doc.category}
              </span>
            </Badge>
            <span className="text-xs text-gray-400">
              {new Date(doc.uploaded_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
