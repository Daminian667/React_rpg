import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 shadow-md ${
          isUser ? 'bg-blue-600 ml-3' : 'bg-emerald-600 mr-3'
        }`}>
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col`}>
            {/* Name */}
            <span className={`text-xs text-gray-500 mb-1 ${isUser ? 'text-right' : 'text-left'}`}>
                {isUser ? 'Вы' : 'Game Master'}
            </span>
            
            <div className={`p-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${
            isUser 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
            }`}>
            {/* Markdown Content */}
            <div className="prose prose-invert prose-p:my-1 prose-headings:my-2 prose-strong:text-white max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;