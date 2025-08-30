import React from 'react';
import { Send, Paperclip, Image, Smile, Mic } from 'lucide-react';
import Button from '../ui/Button';

const MessageInput = ({ message, onMessageChange, onSendMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(e);
  };

  return (
    <div className="bg-white border-t border-border-light p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" type="button">
          <Paperclip className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button">
          <Image className="w-4 h-4" />
        </Button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message..."
            className="w-full pl-4 pr-10 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" type="button">
          <Mic className="w-4 h-4" />
        </Button>
        <Button type="submit" disabled={!message.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
