'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, ArrowLeft, Bot, User, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ChatTypingIndicator } from '@/components/chat-typing-indicator'
import { AnimatedBackground } from '@/components/ui/animated-background'
import SpotMePopup from '@/components/spot-me-popup'
import Link from 'next/link'
import { getChatbotContent, generateResponse } from '@/lib/chatbot-client'
import { ChatbotData } from '@/lib/types'
import { getContent, ContentData } from '@/lib/content'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function AskMePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatbotData, setChatbotData] = useState<ChatbotData | null>(null)
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [isSpotMeOpen, setIsSpotMeOpen] = useState(false)
  const [spotMeRefreshTrigger, setSpotMeRefreshTrigger] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when component loads and after responses
  useEffect(() => {
    if (chatbotData && contentData && !isLoading) {
      // Small delay to ensure the input is rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [chatbotData, contentData, isLoading, messages])

  // Load chatbot and content data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [chatbotContent, allContent] = await Promise.all([
          getChatbotContent(),
          getContent()
        ])
        
        setChatbotData(chatbotContent)
        setContentData(allContent)
        
        // Set initial welcome message
        setMessages([
          {
            id: '1',
            content: chatbotContent.chat.welcome_message,
            role: 'assistant',
            timestamp: new Date()
          }
        ])
      } catch (error) {
        console.error('Failed to load data:', error)
        // Fallback welcome message
        setMessages([
          {
            id: '1',
            content: "Hello! I'm your AI assistant. I can help you with questions about engineering leadership, technology, team management, and more. What would you like to know?",
            role: 'assistant',
            timestamp: new Date()
          }
        ])
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !chatbotData) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response with configurable delay
    const delay = chatbotData.ui.loading_delay.min + Math.random() * chatbotData.ui.loading_delay.max
    
    setTimeout(async () => {
      try {
        const response = await generateResponse(input.trim(), chatbotData, contentData || undefined)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } catch (error) {
        console.error('Error generating response:', error)
        // Fallback response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
      setIsLoading(false)
    }, delay)
  }

  const handleSpotMeClick = () => {
    if (isSpotMeOpen) {
      // If already open, refresh the content
      setSpotMeRefreshTrigger(prev => prev + 1)
    } else {
      // Open the popup
      setIsSpotMeOpen(true)
    }
  }

  const handleSpotMeClose = () => {
    setIsSpotMeOpen(false)
  }

  if (!chatbotData || !contentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ambient:ambient-gradient-bg ambient:dark:ambient-gradient-bg-dark transition-colors duration-300 flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading chatbot and content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ambient:ambient-gradient-bg ambient:dark:ambient-gradient-bg-dark transition-colors duration-300 relative">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 ambient:glass-nav ambient:dark:glass-nav-dark backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600 profile-light-pulse-small ambient:glass-glow">
                  <Image
                    src="/images/profile.png"
                    alt="Soumitra Ghosh"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{chatbotData.navigation.back_link}</span>
              </Link>
            </div>
            
            {/* Center CTA */}
            <div className="flex-1 flex justify-center">
              <Button
                onClick={handleSpotMeClick}
                variant="outline"
                size="sm"
                className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Where is Soumitra?
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{chatbotData.navigation.page_title}</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Interface */}
      <div className={`max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col relative z-10 ${isSpotMeOpen ? 'pointer-events-none opacity-50' : ''}`}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 ambient:glass-glow">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 ambient:glass-card ambient:dark:glass-card-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                } transition-colors`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' 
                    ? 'text-emerald-100' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 ambient:glass-glow">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && <ChatTypingIndicator typingText={chatbotData.chat.typing_indicator} />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ambient:glass-bg ambient:dark:glass-bg-dark p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={chatbotData.chat.input_placeholder}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ambient:glass-input ambient:dark:glass-input-dark text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                disabled={isLoading || isSpotMeOpen}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading || isSpotMeOpen}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 ambient:glass-button ambient:dark:glass-button-dark"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
          
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
            {chatbotData.chat.beta_notice}
          </div>
        </div>
      </div>

      {/* SpotMe Popup */}
      <SpotMePopup
        isOpen={isSpotMeOpen}
        onClose={handleSpotMeClose}
        refreshTrigger={spotMeRefreshTrigger}
      />
    </div>
  )
} 