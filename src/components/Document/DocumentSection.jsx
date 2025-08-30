import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import DocumentCard from './DocumentCard';
import { 
  User,
  DollarSign,
  Share2,
  Briefcase
} from 'lucide-react';

const DocumentSection = ({ 
  title, 
  documents, 
  icon: Icon, 
  badgeVariant, 
  category,
  filteredDocuments 
}) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant={badgeVariant}>{documents.length}</Badge>
        </div>
      </Card.Header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredDocuments(documents).map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </Card>
  );
};

export default DocumentSection;
