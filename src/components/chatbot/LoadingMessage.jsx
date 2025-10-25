import React from 'react'
import { Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '../ui/avatar'

const LoadingMessage = () => {
  return (
    <div className="flex justify-start items-start gap-3 transition-all duration-300 ease-out">
      <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
        <Avatar className="w-11 h-11 border-2 border-blue-200">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot className="w-6 h-6 text-white" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-semibold text-gray-700">Admin</span>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        </div>
      </div>
    </div>
  )
}

export default LoadingMessage
