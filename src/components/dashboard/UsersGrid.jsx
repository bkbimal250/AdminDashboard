import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { User, Eye, Edit, MessageSquare } from 'lucide-react';

const UsersGrid = ({ recentUsers }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentUsers.map((user, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" hover>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100/30 opacity-40"></div>
            
            <Card.Body className="relative p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-lg group-hover:text-gray-800 transition-colors">
                    {user.first_name} {user.last_name}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <Badge variant="outline" className="mt-2">
                    {user.role || 'User'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
                <Badge variant={user.is_active ? 'success' : 'danger'} size="sm">
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-200/20 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-indigo-200/20 rounded-full translate-y-4 -translate-x-4"></div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersGrid;
