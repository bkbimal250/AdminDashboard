import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ 
  selectedChat, 
  user, 
  messages, 
  message, 
  isTyping, 
  messagesEndRef, 
  onBackClick, 
  onMessageChange, 
  onSendMessage 
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <ChatHeader 
        selectedChat={selectedChat} 
        user={user} 
        onBackClick={onBackClick} 
      />

      {/* Messages */}
      <MessageList 
        messages={messages} 
        isTyping={isTyping} 
        messagesEndRef={messagesEndRef} 
      />

      {/* Message Input */}
      <MessageInput 
        message={message} 
        onMessageChange={onMessageChange} 
        onSendMessage={onSendMessage} 
      />
    </div>
  );
};

export default ChatWindow;
