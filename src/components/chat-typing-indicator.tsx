import React from 'react'
import { Bot } from 'lucide-react'

interface ChatTypingIndicatorProps {
  typingText?: string
}

export function ChatTypingIndicator({ typingText = "Typing..." }: ChatTypingIndicatorProps) {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">{typingText}</span>
        </div>
      </div>
    </div>
  )
} 