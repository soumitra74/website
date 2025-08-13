export interface ChatbotData {
  metadata: {
    title: string
    description: string
  }
  navigation: {
    back_link: string
    page_title: string
  }
  chat: {
    welcome_message: string
    input_placeholder: string
    send_button: string
    typing_indicator: string
    beta_notice: string
  }
  responses: {
    context_aware: {
      [key: string]: {
        keywords: string[]
        response: string
      }
    }
    default: string[]
  }
  ui: {
    loading_delay: {
      min: number
      max: number
    }
    messages: {
      user_avatar_alt: string
      assistant_avatar_alt: string
    }
  }
}

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

// Client-side search function using Lunr.js
export async function generateResponseWithSearch(userInput: string): Promise<string> {
  try {
    // Load both content and chatbot data
    const [contentResponse, chatbotResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content`, {
        cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chatbot`, {
        cache: 'no-store'
      })
    ])

    if (!contentResponse.ok || !chatbotResponse.ok) {
      throw new Error('Failed to load data')
    }

    const contentData = await contentResponse.json()
    const chatbotData = await chatbotResponse.json()

    // Import the client-side search function dynamically to avoid SSR issues
    const { generateResponseFromSearch } = await import('./client-search')
    
    // Generate response using client-side search
    return generateResponseFromSearch(userInput, contentData, chatbotData)
  } catch (error) {
    console.error('Error generating response:', error)
    // Fallback to client-side generation if search fails
    throw error
  }
}

// Legacy function for backward compatibility
export function generateResponse(userInput: string, chatbotData: ChatbotData): string {
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