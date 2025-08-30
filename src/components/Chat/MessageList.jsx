import React from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-secondary-50 p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-text-secondary">No messages yet. Start a conversation!</div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))
        )}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
