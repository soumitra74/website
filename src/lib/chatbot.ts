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

// Server-side function for fetching chatbot content during build
export async function getChatbotContentServer(): Promise<ChatbotData> {
  try {
    // During build time, read the file directly
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      const fs = await import('fs')
      const path = await import('path')
      const filePath = path.join(process.cwd(), 'data', 'chatbot.json')
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    }
    
    // During development, use the API route
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