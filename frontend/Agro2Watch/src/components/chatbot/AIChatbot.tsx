import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Mic, 
  Image as ImageIcon,
  Languages,
  Settings,
  Trash2,
  Download
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTranslation } from '@/lib/translations';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  type?: string;
  timestamp: string;
  suggestions?: string[];
  quick_actions?: any[];
  actions?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const AIChatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, className = '' }) => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userContext, setUserContext] = useState({
    location: '',
    crops: [],
    farm_size: '',
    farming_type: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = 'user_' + Math.random().toString(36).substr(2, 9); // Generate unique user ID

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send initial greeting
      handleInitialGreeting();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInitialGreeting = async () => {
    try {
      const response = await fetch('/api/v1/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          message: 'Hello',
          language: language,
          context: userContext
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addBotMessage(data);
      }
    } catch (error) {
      console.error('Error sending initial greeting:', error);
      addBotMessage({
        text: getLocalizedGreeting(),
        type: 'greeting',
        quick_actions: getDefaultQuickActions(),
        suggestions: ['Weather forecast', 'Crop problems', 'Government schemes']
      });
    }
  };

  const getLocalizedGreeting = () => {
    const greetings = {
      en: "Hello! I'm your AI farming assistant. How can I help you today?",
      hi: "नमस्ते! मैं आपका AI कृषि सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      ta: "வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
      te: "నమస్కారం! నేను మీ AI వ్యవసాయ సహాయకుడిని। ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      bn: "নমস্কার! আমি আপনার AI কৃষি সহায়ক। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      mr: "नमस्कार! मी तुमचा AI शेती सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
      gu: "નમસ્તે! હું તમારો AI ખેતી સહાયક છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?"
    };
    return greetings[language] || greetings.en;
  };

  const getDefaultQuickActions = () => [
    { title: "Weather Forecast", action: "weather_query", icon: "cloud" },
    { title: "Crop Problems", action: "crop_problem", icon: "bug" },
    { title: "Government Schemes", action: "schemes_info", icon: "government" },
    { title: "Market Prices", action: "market_prices", icon: "trending-up" }
  ];

  const sendMessage = async (message: string, imageFile?: File) => {
    if (!message.trim() && !imageFile) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response;
      
      if (imageFile) {
        // Handle image message
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('message', message);
        formData.append('language', language);
        formData.append('image_file', imageFile);

        response = await fetch('/api/v1/chatbot/image-query', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Handle text message
        response = await fetch('/api/v1/chatbot/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            message: message,
            language: language,
            context: userContext
          }),
        });
      }

      if (response.ok) {
        const data = await response.json();
        addBotMessage(data);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage({
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        type: 'error',
        suggestions: ['Try again', 'Help']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addBotMessage = (data: any) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text: data.text,
      type: data.type,
      timestamp: data.timestamp || new Date().toISOString(),
      suggestions: data.suggestions,
      quick_actions: data.quick_actions,
      actions: data.actions
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleQuickAction = (action: any) => {
    const actionMessages = {
      weather_query: "What's the weather forecast for farming?",
      crop_problem: "I have a problem with my crops",
      schemes_info: "Tell me about government schemes for farmers",
      market_prices: "What are the current market prices?",
      soil_advice: "I need advice about soil health",
      expert_connect: "I want to connect with an expert"
    };
    
    const message = actionMessages[action.action] || `Help me with ${action.title}`;
    sendMessage(message);
  };

  const clearChat = async () => {
    try {
      await fetch(`/api/v1/chatbot/history/${userId}`, {
        method: 'DELETE',
      });
      setMessages([]);
      handleInitialGreeting();
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrowatch-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className={`fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 shadow-lg bg-green-600 hover:bg-green-700 ${className}`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className={`w-96 shadow-xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-green-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle className="text-sm font-medium">
              {t.aiAssistant || 'AI Assistant'}
            </CardTitle>
            <Badge variant="secondary" className="text-xs bg-green-500 text-white">
              {language.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-green-700 h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-green-700 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-green-700 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Settings Panel */}
        {showSettings && !isMinimized && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Chat Settings</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportChat}
                  className="h-8 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="h-8 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Language: {language.toUpperCase()} • Messages: {messages.length}
            </div>
          </div>
        )}

        {/* Chat Content */}
        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onSuggestionClick={handleSuggestionClick}
                    onQuickAction={handleQuickAction}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <ChatInput
                onSendMessage={sendMessage}
                isLoading={isLoading}
                placeholder={t.typeMessage || 'Type your farming question...'}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AIChatbot;