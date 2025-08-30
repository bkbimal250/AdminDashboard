import React from 'react';
import { User, Circle } from 'lucide-react';
import Badge from '../ui/Badge';

const ChatItem = ({ chat, user, onClick }) => {
  const otherParticipant = chat.participants?.find(p => p.id !== user?.id);
  const isGroup = chat.participants?.length > 2;
  const chatName = isGroup 
    ? `Group (${chat.participants?.length} members)` 
    : otherParticipant?.username || 'Unknown User';
  
  const lastMessage = chat.last_message?.message || 'No messages yet';
  const lastMessageTime = chat.last_message?.created_at 
    ? new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';

  return (
    <div
      onClick={() => onClick(chat)}
      className="flex items-center space-x-3 p-4 hover:bg-secondary-50 cursor-pointer border-b border-border-light"
    >
      <div className="relative">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary-600" />
        </div>
        {otherParticipant?.is_online && (
          <Circle className="w-3 h-3 text-success-600 absolute -bottom-1 -right-1 fill-current" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-text-primary truncate">
            {chatName}
          </h3>
          <span className="text-xs text-text-secondary">
            {lastMessageTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary truncate">
            {lastMessage}
          </p>
          {chat.unread_count > 0 && (
            <Badge variant="primary" size="sm">
              {chat.unread_count}
            </Badge>
          )}
        </div>
        {isGroup && (
          <p className="text-xs text-text-muted">
            {chat.participants?.length} members
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
