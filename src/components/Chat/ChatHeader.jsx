import React from 'react';
import { User, Phone, Video, MoreVertical, Circle } from 'lucide-react';
import Button from '../ui/Button';

const ChatHeader = ({ selectedChat, user, onBackClick }) => {
  const otherParticipant = selectedChat?.participants?.find(p => p.id !== user?.id);
  const isGroup = selectedChat?.participants?.length > 2;
  const chatName = isGroup 
    ? `Group (${selectedChat?.participants?.length} members)` 
    : otherParticipant?.username || 'Unknown User';
  
  const isOnline = selectedChat?.participants?.some(p => p.id !== user?.id && p.is_online);

  return (
    <div className="bg-white border-b border-border-light px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBackClick}
            className="lg:hidden"
          >
            <User className="w-4 h-4" />
          </Button>
          <div className="relative">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            {isOnline && (
              <Circle className="w-2.5 h-2.5 text-success-600 absolute -bottom-1 -right-1 fill-current" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">
              {chatName}
            </h2>
            <p className="text-sm text-text-secondary">
              {isOnline ? 'Online' : 'Offline'}
              {isGroup && ` • ${selectedChat?.participants?.length} members`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
