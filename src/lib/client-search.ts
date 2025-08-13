import lunr from 'lunr'
import { ContentData } from './content'
import { ChatbotData } from './chatbot'

export interface SearchResult {
  type: 'content' | 'chatbot'
  title: string
  content: string
  relevance: number
  source: string
}

export interface SearchableContent {
  id: string
  title: string
  content: string
  type: 'content' | 'chatbot'
  source: string
}

// Create searchable content from ContentData
function createContentSearchableData(contentData: ContentData): SearchableContent[] {
  const searchableData: SearchableContent[] = []

  // Add about section
  searchableData.push({
    id: 'about',
    title: contentData.about.title,
    content: contentData.about.subtitle + ' ' + contentData.about.content.journey.paragraphs.join(' '),
    type: 'content',
    source: 'About Section'
  })

  // Add experience roles
  contentData.experience.roles.forEach((role, index) => {
    const roleContent = `${role.title} at ${role.company} ${role.duration || ''} ${role.description || ''}`
    const productsContent = (role.products || role.companies || [])
      .map(item => `${item.name}: ${item.description}`)
      .join(' ')
    
    searchableData.push({
      id: `experience-${index}`,
      title: `${role.title} - ${role.company}`,
      content: roleContent + ' ' + productsContent,
      type: 'content',
      source: 'Experience'
    })
  })

  // Add portfolio projects
  contentData.portfolio.projects.forEach((project, index) => {
    const projectContent = `${project.description} ${project.challenge} ${project.solution} ${project.technologies.join(' ')} ${project.achievements.join(' ')}`
    
    searchableData.push({
      id: `portfolio-${index}`,
      title: project.name,
      content: projectContent,
      type: 'content',
      source: 'Portfolio'
    })
  })

  // Add expertise areas
  contentData.expertise.areas.forEach((area, index) => {
    searchableData.push({
      id: `expertise-${index}`,
      title: area.title,
      content: area.description,
      type: 'content',
      source: 'Expertise'
    })
  })

  // Add training certifications
  contentData.training.certifications.forEach((cert, index) => {
    const certContent = `${cert.title} ${cert.institution} ${cert.duration} ${cert.description} ${cert.achievement || ''}`
    
    searchableData.push({
      id: `training-${index}`,
      title: cert.title,
      content: certContent,
      type: 'content',
      source: 'Training'
    })
  })

  // Add events
  contentData.events.events.forEach((event, index) => {
    const eventContent = `${event.title} ${event.description} ${event.location} ${event.tags.join(' ')} ${event.highlights.join(' ')}`
    
    searchableData.push({
      id: `event-${index}`,
      title: event.title,
      content: eventContent,
      type: 'content',
      source: 'Events'
    })
  })

  return searchableData
}

// Create searchable content from ChatbotData
function createChatbotSearchableData(chatbotData: ChatbotData): SearchableContent[] {
  const searchableData: SearchableContent[] = []

  // Add context-aware responses
  Object.entries(chatbotData.responses.context_aware).forEach(([key, context]) => {
    searchableData.push({
      id: `chatbot-${key}`,
      title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      content: context.keywords.join(' ') + ' ' + context.response,
      type: 'chatbot',
      source: 'Chatbot Responses'
    })
  })

  // Add default responses
  chatbotData.responses.default.forEach((response, index) => {
    searchableData.push({
      id: `chatbot-default-${index}`,
      title: 'General Response',
      content: response,
      type: 'chatbot',
      source: 'Chatbot Default'
    })
  })

  return searchableData
}

// Create Lunr index
function createSearchIndex(contentData: ContentData, chatbotData: ChatbotData): lunr.Index {
  const contentSearchableData = createContentSearchableData(contentData)
  const chatbotSearchableData = createChatbotSearchableData(chatbotData)
  const allSearchableData = [...contentSearchableData, ...chatbotSearchableData]

  return lunr(function() {
    this.ref('id')
    this.field('title', { boost: 3 })
    this.field('content', { boost: 2 })
    this.field('source', { boost: 1 })

    // Add all documents to the index
    allSearchableData.forEach(doc => {
      this.add(doc)
    })
  })
}

// Client-side search function that prioritizes ContentData over ChatbotData
export function searchContent(
  query: string,
  contentData: ContentData,
  chatbotData: ChatbotData,
  maxResults: number = 5
): SearchResult[] {
  if (!query.trim()) {
    return []
  }

  const index = createSearchIndex(contentData, chatbotData)
  const contentSearchableData = createContentSearchableData(contentData)
  const chatbotSearchableData = createChatbotSearchableData(chatbotData)
  const allSearchableData = [...contentSearchableData, ...chatbotSearchableData]

  // Create a map for quick lookup
  const dataMap = new Map(allSearchableData.map(item => [item.id, item]))

  // Search in the index
  const searchResults = index.search(query)

  // Convert to SearchResult format and prioritize content over chatbot
  const results: SearchResult[] = searchResults
    .map(result => {
      const data = dataMap.get(result.ref)
      if (!data) return null

      return {
        type: data.type,
        title: data.title,
        content: data.content,
        relevance: result.score || 0,
        source: data.source
      }
    })
    .filter((result): result is SearchResult => result !== null)

  // Separate content and chatbot results
  const contentResults = results.filter(r => r.type === 'content')
  const chatbotResults = results.filter(r => r.type === 'chatbot')

  // Return content results first, then chatbot results if needed
  const finalResults = [...contentResults]
  
  // Only add chatbot results if we don't have enough content results
  if (contentResults.length < maxResults) {
    const remainingSlots = maxResults - contentResults.length
    finalResults.push(...chatbotResults.slice(0, remainingSlots))
  }

  return finalResults.slice(0, maxResults)
}

// Generate response based on search results
export function generateResponseFromSearch(
  query: string,
  contentData: ContentData,
  chatbotData: ChatbotData
): string {
  const searchResults = searchContent(query, contentData, chatbotData, 3)

  if (searchResults.length === 0) {
    // Fallback to original chatbot logic
    const input = query.toLowerCase()
    
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

  // Use the most relevant result
  const bestResult = searchResults[0]
  
  if (bestResult.type === 'content') {
    // For content results, provide a more contextual response
    return `Based on my experience, ${bestResult.content.substring(0, 200)}... Would you like me to elaborate on this topic or discuss something else?`
  } else {
    // For chatbot results, use the original response
    return bestResult.content
  }
}
