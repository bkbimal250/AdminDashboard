import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageItem = ({ message }) => {
  return (
    <div
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            message.isOwn
              ? 'bg-primary-600 text-white'
              : 'bg-white text-text-primary border border-border-light'
          }`}
        >
          <p className="text-sm">{message.message}</p>
        </div>
        <div className={`flex items-center space-x-2 mt-1 text-xs text-text-secondary ${
          message.isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span>{message.timestamp}</span>
          {message.isOwn && (
            <span>
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-primary-600" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
