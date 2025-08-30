import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import Button from '../ui/Button';
import ChatList from './ChatList';

const ChatSidebar = ({ 
  chats, 
  user, 
  searchTerm, 
  onSearchChange, 
  onChatSelect, 
  loading 
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Messages</h1>
            <p className="text-text-secondary">Chat with your team members</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <UsersIcon className="w-4 h-4 mr-2" />
              New Group
            </Button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <ChatList
        chats={chats}
        user={user}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onChatSelect={onChatSelect}
        loading={loading}
      />
    </div>
  );
};

export default ChatSidebar;
