import React from 'react'
import { User, Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'

const Message = ({ message }) => {
  const { text, sender, timestamp, status } = message;

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 transition-all duration-300 ease-out`}>
      {sender === 'bot' && (
        <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
          <Avatar className="w-11 h-11 border-2 border-black">
            <AvatarFallback>
              <Bot className="w-6 h-6 text-black" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-gray-700">Admin</span>
          {status && (
            <Badge variant="outline" className="text-xs border-green-500 text-green-600 bg-green-50">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1 animate-pulse"></span>
              {status}
            </Badge>
          )}
        </div>
      )}
      
      <div className={`flex flex-col ${sender === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            sender === 'user'
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
            {text}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1.5 px-2">
          {timestamp} น.
        </span>
      </div>

      {sender === 'user' && (
        <Avatar className="w-11 h-11 border-2 border-gray-300">
          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600">
            <User className="w-6 h-6 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message