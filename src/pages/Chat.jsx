import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../services/api';
import { ChatSidebar, ChatWindow } from '../components/Chat';

const Chat = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chat: Starting to fetch chat rooms data...');
      
      const response = await chatAPI.getChatRooms();
      console.log('📊 Chat: API Response Received:');
      console.log('💬 Chat Rooms API Response:', {
        data: response.data,
        status: response.status,
        headers: response.headers,
        count: Array.isArray(response.data) ? response.data.length : 'Not an array'
      });
      
      const chatsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.results || response.data?.data || [];
      
      console.log('💬 Chat: Processed chat rooms data:', {
        original: response.data,
        processed: chatsData,
        totalRooms: chatsData.length,
        onlineUsers: chatsData.filter(chat => chat.participants?.some(p => p.is_online)).length,
        groupChats: chatsData.filter(chat => chat.participants?.length > 2).length,
        privateChats: chatsData.filter(chat => chat.participants?.length <= 2).length,
        unreadMessages: chatsData.reduce((sum, chat) => sum + (chat.unread_count || 0), 0)
      });
      
      setChats(chatsData);
      console.log('✅ Chat: Chat rooms data processed and state updated successfully');
    } catch (error) {
      console.error('❌ Chat: Error fetching chat rooms:', error);
      console.error('❌ Chat: Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setChats([]);
    } finally {
      setLoading(false);
      console.log('🏁 Chat: Chat rooms loading completed');
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      console.log('🔄 Chat: Starting to fetch messages for chat ID:', chatId);
      
      const response = await chatAPI.getRoomMessages(chatId);
      console.log('📊 Chat: Messages API Response Received:');
      console.log('💬 Chat Messages API Response:', {
        data: response.data,
        status: response.status,
        headers: response.headers,
        count: Array.isArray(response.data) ? response.data.length : 'Not an array'
      });
      
      const messagesData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.results || response.data?.data || [];
      
      // Transform API data to match expected format
      const transformedMessages = messagesData.map(msg => ({
        id: msg.id,
        sender: msg.sender_name || msg.sender || 'Unknown',
        senderId: msg.sender_id || msg.sender,
        message: msg.content || msg.message || '',
        timestamp: new Date(msg.created_at || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: msg.sender_id === user?.id,
        isRead: msg.is_read || true
      }));
      
      console.log('💬 Chat: Processed messages data:', {
        original: response.data,
        processed: messagesData,
        transformed: transformedMessages,
        totalMessages: transformedMessages.length,
        ownMessages: transformedMessages.filter(msg => msg.isOwn).length,
        otherMessages: transformedMessages.filter(msg => !msg.isOwn).length,
        readMessages: transformedMessages.filter(msg => msg.isRead).length,
        unreadMessages: transformedMessages.filter(msg => !msg.isRead).length
      });
      
      setMessages(transformedMessages);
      console.log('✅ Chat: Messages data processed and state updated successfully');
    } catch (error) {
      console.error('❌ Chat: Error fetching messages:', error);
      console.error('❌ Chat: Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    try {
      const messageData = {
        room_id: selectedChat.id,
        content: message.trim(),
        sender_id: user?.id
      };

      const response = await chatAPI.sendMessage(messageData);
      console.log('Send Message API Response:', response.data);

      const newMessage = {
        id: response.data.id || Date.now(),
        sender: user?.username || 'You',
        senderId: user?.id,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        isRead: false
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Update last message in chat list
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: newMessage.message, lastMessageTime: newMessage.timestamp }
          : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error message to the user here
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  // If no chat is selected, show the sidebar
  if (!selectedChat) {
    return (
      <ChatSidebar
        chats={chats}
        user={user}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onChatSelect={handleChatSelect}
        loading={loading}
      />
    );
  }

  // If a chat is selected, show the chat window
  return (
    <ChatWindow
      selectedChat={selectedChat}
      user={user}
      messages={messages}
      message={message}
      isTyping={isTyping}
      messagesEndRef={messagesEndRef}
      onBackClick={handleBackClick}
      onMessageChange={setMessage}
      onSendMessage={handleSendMessage}
    />
  );
};

export default Chat;
