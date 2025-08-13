import { ChatbotData } from './types'

// Client-side function for fetching chatbot content
export async function getChatbotContent(): Promise<ChatbotData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chatbot`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch chatbot content: ${response.status}`)
    }

    const content = await response.json()
    return content
  } catch (error) {
    console.error('Error fetching chatbot content:', error)
    throw error
  }
}

import { searchContent, generateResponseFromSearch } from './search'
import { getContent, ContentData } from './content'

export async function generateResponse(userInput: string, chatbotData: ChatbotData, contentData?: ContentData): Promise<string> {
  try {
    // If contentData is not provided, fetch it
    let content: ContentData
    if (!contentData) {
      content = await getContent()
    } else {
      content = contentData
    }

    // Use the new search functionality
    const searchResults = await searchContent(userInput, content, chatbotData)
    return generateResponseFromSearch(userInput, searchResults.results, chatbotData)
  } catch (error) {
    console.error('Error in generateResponse:', error)
    
    // Fallback to original logic
    const input = userInput.toLowerCase()
    
    // Check context-aware responses
    for (const [key, context] of Object.entries(chatbotData.responses.context_aware)) {
      if (context.keywords.some(keyword => input.includes(keyword))) {
        return context.response
      }
    }
    
    // Return random default response
    const defaultResponses = chatbotData.responses.default
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }
} 