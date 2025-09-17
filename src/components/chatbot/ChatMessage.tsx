import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bot, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Copy,
  ExternalLink,
  Cloud,
  Bug,
  Building,
  TrendingUp,
  Layers,
  UserCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface ChatMessageProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
  onQuickAction: (action: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestionClick, onQuickAction }) => {
  const isUser = message.sender === 'user';
  
  const getActionIcon = (iconName: string) => {
    const icons = {
      cloud: Cloud,
      bug: Bug,
      government: Building,
      'trending-up': TrendingUp,
      layers: Layers,
      'user-check': UserCheck
    };
    const IconComponent = icons[iconName] || ExternalLink;
    return <IconComponent className="h-4 w-4" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessageText = (text: string) => {
    // Convert markdown-like formatting to JSX
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-green-600 text-white ml-auto'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {/* Message Header */}
          <div className="flex items-center space-x-2 mb-1">
            {isUser ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4 text-green-600" />
            )}
            <span className="text-xs font-medium">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            <Clock className="h-3 w-3 opacity-60" />
            <span className="text-xs opacity-60">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
          </div>

          {/* Message Content */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {formatMessageText(message.text)}
          </div>

          {/* Message Type Badge */}
          {message.type && message.type !== 'general' && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {message.type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          )}

          {/* Message Actions */}
          {!isUser && (
            <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.text)}
                className="h-6 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-green-600"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-gray-400"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {message.quick_actions && message.quick_actions.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-600 font-medium">Quick Actions:</div>
            <div className="grid grid-cols-2 gap-2">
              {message.quick_actions.slice(0, 4).map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickAction(action)}
                  className="h-auto p-2 text-left flex flex-col items-start space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    {getActionIcon(action.icon)}
                    <span className="text-xs font-medium">{action.title}</span>
                  </div>
                  {action.description && (
                    <span className="text-xs text-gray-500">{action.description}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-600 font-medium">Suggestions:</div>
            <div className="flex flex-wrap gap-1">
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="h-7 px-3 text-xs rounded-full"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-600 font-medium">Available Actions:</div>
            <div className="space-y-1">
              {message.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(action)}
                  className="w-full h-8 text-xs justify-start"
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  {action.replace('_', ' ').toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;