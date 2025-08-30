import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white rounded-lg px-4 py-2 border border-border-light">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
