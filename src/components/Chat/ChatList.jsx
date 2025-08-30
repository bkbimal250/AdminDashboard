import React from 'react';
import { Search } from 'lucide-react';
import ChatItem from './ChatItem';

const ChatList = ({ 
  chats, 
  user, 
  searchTerm, 
  onSearchChange, 
  onChatSelect, 
  loading 
}) => {
  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants?.find(p => p.id !== user?.id);
    const chatName = chat.participants?.length > 2 
      ? `Group (${chat.participants?.length} members)` 
      : otherParticipant?.username || 'Unknown User';
    
    return (chatName || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex-1 overflow-hidden">
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg"
          />
        </div>
      </div>

      <div className="overflow-y-auto h-full">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-text-secondary">Loading chats...</div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-text-secondary">No chats found</div>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              user={user}
              onClick={onChatSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
