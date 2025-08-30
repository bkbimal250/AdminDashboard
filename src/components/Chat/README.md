# Chat Components

This folder contains all the modular components for the Chat functionality. The components are designed to be reusable and maintainable.

## Components Overview

### Core Components

- **ChatSidebar** - The main sidebar that displays the chat list when no chat is selected
- **ChatWindow** - The main chat window that displays messages and input when a chat is selected

### Sub-Components

- **ChatHeader** - Header component for the chat window with user info and action buttons
- **ChatList** - List component that displays all available chats with search functionality
- **ChatItem** - Individual chat item component for each chat room
- **MessageList** - Container for displaying all messages in a chat
- **MessageItem** - Individual message component
- **MessageInput** - Input form for sending messages
- **TypingIndicator** - Animated typing indicator component

## Usage

### Basic Usage

```jsx
import { ChatSidebar, ChatWindow } from '../components/Chat';

// In your main Chat component
const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  
  if (!selectedChat) {
    return (
      <ChatSidebar
        chats={chats}
        user={user}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onChatSelect={setSelectedChat}
        loading={loading}
      />
    );
  }
  
  return (
    <ChatWindow
      selectedChat={selectedChat}
      user={user}
      messages={messages}
      message={message}
      isTyping={isTyping}
      messagesEndRef={messagesEndRef}
      onBackClick={() => setSelectedChat(null)}
      onMessageChange={setMessage}
      onSendMessage={handleSendMessage}
    />
  );
};
```

### Individual Component Usage

```jsx
import { ChatHeader, MessageList, MessageInput } from '../components/Chat';

// Using individual components
<ChatHeader 
  selectedChat={selectedChat} 
  user={user} 
  onBackClick={handleBackClick} 
/>

<MessageList 
  messages={messages} 
  isTyping={isTyping} 
  messagesEndRef={messagesEndRef} 
/>

<MessageInput 
  message={message} 
  onMessageChange={setMessage} 
  onSendMessage={handleSendMessage} 
/>
```

## Props

### ChatSidebar
- `chats` - Array of chat objects
- `user` - Current user object
- `searchTerm` - Search input value
- `onSearchChange` - Function to handle search input changes
- `onChatSelect` - Function to handle chat selection
- `loading` - Boolean for loading state

### ChatWindow
- `selectedChat` - Currently selected chat object
- `user` - Current user object
- `messages` - Array of message objects
- `message` - Current message input value
- `isTyping` - Boolean for typing indicator
- `messagesEndRef` - Ref for auto-scrolling to bottom
- `onBackClick` - Function to handle back button click
- `onMessageChange` - Function to handle message input changes
- `onSendMessage` - Function to handle message sending

### ChatItem
- `chat` - Chat object
- `user` - Current user object
- `onClick` - Function to handle chat selection

### MessageItem
- `message` - Message object with properties:
  - `id` - Message ID
  - `message` - Message content
  - `timestamp` - Message timestamp
  - `isOwn` - Boolean indicating if message is from current user
  - `isRead` - Boolean indicating if message is read

## Data Structure

### Chat Object
```javascript
{
  id: string,
  participants: [
    {
      id: string,
      username: string,
      is_online: boolean
    }
  ],
  last_message: {
    message: string,
    created_at: string
  },
  unread_count: number
}
```

### Message Object
```javascript
{
  id: string,
  sender: string,
  senderId: string,
  message: string,
  timestamp: string,
  isOwn: boolean,
  isRead: boolean
}
```

## Features

- **Responsive Design** - Components work on both desktop and mobile
- **Search Functionality** - Filter chats by name
- **Online Status** - Display online/offline status for users
- **Unread Count** - Show unread message count
- **Typing Indicator** - Animated typing indicator
- **Auto-scroll** - Automatically scroll to bottom on new messages
- **Message Status** - Show read/unread status for sent messages

## Styling

All components use Tailwind CSS classes and follow the design system defined in the project. The components use consistent color variables and spacing defined in the global CSS.
