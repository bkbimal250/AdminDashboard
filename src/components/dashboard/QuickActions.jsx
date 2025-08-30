import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Eye } from 'lucide-react';

const QuickActions = ({ quickActions }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quickActions.map((action, index) => (
        <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer" hover>
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100/30 opacity-40`}></div>
          
          <Card.Body className="relative text-center p-6">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-gray-800 transition-colors">
              {action.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
              {action.description}
            </p>
            
            <Button
              variant="outline"
              size="md"
              className="w-full group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-300"
              onClick={() => window.location.href = action.href}
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="font-semibold">Access</span>
            </Button>
            
            {/* Decorative elements */}
            <div className={`absolute top-0 right-0 w-12 h-12 bg-${action.color}-200/20 rounded-full -translate-y-6 translate-x-6`}></div>
            <div className={`absolute bottom-0 left-0 w-8 h-8 bg-${action.color}-200/20 rounded-full translate-y-4 -translate-x-4`}></div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
