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
