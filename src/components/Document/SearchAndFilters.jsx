import React from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { Search } from 'lucide-react';

const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal</option>
              <option value="shared">Shared</option>
              <option value="company">Company</option>
              <option value="salary">Salary</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SearchAndFilters;
