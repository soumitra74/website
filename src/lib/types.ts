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

export interface DetailedContentData {
  landing_page_introduction: {
    title: string
    intro: string
    body: string
  }
  about_me: {
    title: string
    intro: string
    body: string
  }
  career_highlights: {
    title: string
    roles: Array<{
      role: string
      description: string
    }>
  }
  thought_leadership_and_ip: {
    title: string
    items: Array<{
      type: string
      description: string
    }>
  }
  tech_stack_and_interests: {
    title: string
    skills: {
      [key: string]: string
    }
  }
  beyond_work: {
    title: string
    activities: string[]
  }
  connect: {
    title: string
    linkedin: string
    email: string
    note: string
  }
}

export interface ExperienceWithDatesData {
  name: string
  title: string
  sections: Array<{
    company: string
    title: string
    location: string
    summary: string
    highlights: string[]
    start_date: string
    end_date: string
  }>
}
