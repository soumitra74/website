import Fuse from 'fuse.js'
import { ContentData } from './content'
import { ChatbotData } from './types'

// Interface for searchable content items
interface SearchableItem {
  id: string
  type: 'experience' | 'portfolio' | 'expertise' | 'training' | 'events' | 'about'
  title: string
  content: string
  keywords?: string[]
  source: 'content' | 'chatbot'
}

// Fuse.js options for fuzzy searching
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'content', weight: 0.5 },
    { name: 'keywords', weight: 0.3 }
  ],
  threshold: 0.3, // Lower threshold = more strict matching
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true
}

// Transform ContentData into searchable items
function transformContentDataToSearchableItems(contentData: ContentData): SearchableItem[] {
  const items: SearchableItem[] = []

  // Add about section
  if (contentData.about) {
    items.push({
      id: 'about-journey',
      type: 'about',
      title: contentData.about.title,
      content: contentData.about.content.journey.paragraphs.join(' '),
      keywords: ['journey', 'career', 'background', 'about'],
      source: 'content'
    })

    // Add expertise cards
    contentData.about.content.cards.forEach((card, index) => {
      items.push({
        id: `about-card-${index}`,
        type: 'about',
        title: card.title,
        content: card.description,
        keywords: [card.title.toLowerCase(), 'expertise', 'skills'],
        source: 'content'
      })
    })
  }

  // Add experience roles
  if (contentData.experience) {
    contentData.experience.roles.forEach((role, index) => {
      items.push({
        id: `experience-${index}`,
        type: 'experience',
        title: `${role.title} at ${role.company}`,
        content: role.description || '',
        keywords: [role.title.toLowerCase(), role.company.toLowerCase(), 'experience', 'work'],
        source: 'content'
      })
    })
  }

  // Add portfolio projects
  if (contentData.portfolio) {
    contentData.portfolio.projects.forEach((project, index) => {
      items.push({
        id: `portfolio-${index}`,
        type: 'portfolio',
        title: project.name,
        content: `${project.description} ${project.challenge} ${project.solution} ${project.technologies.join(' ')}`,
        keywords: [...project.technologies, project.type.toLowerCase(), 'project', 'portfolio'],
        source: 'content'
      })
    })
  }

  // Add expertise areas
  if (contentData.expertise) {
    contentData.expertise.areas.forEach((area, index) => {
      items.push({
        id: `expertise-${index}`,
        type: 'expertise',
        title: area.title,
        content: area.description,
        keywords: [area.title.toLowerCase(), 'expertise', 'skills'],
        source: 'content'
      })
    })
  }

  // Add training certifications
  if (contentData.training) {
    contentData.training.certifications.forEach((cert, index) => {
      items.push({
        id: `training-${index}`,
        type: 'training',
        title: cert.title,
        content: `${cert.description} ${cert.institution}`,
        keywords: [cert.title.toLowerCase(), cert.institution.toLowerCase(), 'certification', 'training'],
        source: 'content'
      })
    })
  }

  // Add events
  if (contentData.events) {
    contentData.events.events.forEach((event, index) => {
      items.push({
        id: `event-${index}`,
        type: 'events',
        title: event.title,
        content: `${event.description} ${event.role} ${event.institution} ${event.tags.join(' ')}`,
        keywords: [...event.tags, event.type.toLowerCase(), 'event', 'speaking'],
        source: 'content'
      })
    })
  }

  return items
}

// Transform ChatbotData into searchable items
function transformChatbotDataToSearchableItems(chatbotData: ChatbotData): SearchableItem[] {
  const items: SearchableItem[] = []

  // Add context-aware responses
  Object.entries(chatbotData.responses.context_aware).forEach(([key, context]) => {
    items.push({
      id: `chatbot-${key}`,
      type: 'about' as any, // Using 'about' as default type for chatbot items
      title: key,
      content: context.response,
      keywords: context.keywords,
      source: 'chatbot'
    })
  })

  return items
}

// Main search function
export async function searchContent(
  query: string,
  contentData: ContentData,
  chatbotData: ChatbotData
): Promise<{
  results: SearchableItem[]
  source: 'content' | 'chatbot' | 'both'
  totalResults: number
}> {
  if (!query.trim()) {
    return { results: [], source: 'content', totalResults: 0 }
  }

  // Transform data into searchable items
  const contentItems = transformContentDataToSearchableItems(contentData)
  const chatbotItems = transformChatbotDataToSearchableItems(chatbotData)

  // Create Fuse instances
  const contentFuse = new Fuse(contentItems, fuseOptions)
  const chatbotFuse = new Fuse(chatbotItems, fuseOptions)

  // Search in ContentData first
  const contentResults = contentFuse.search(query)
  const contentMatches = contentResults
    .filter(result => result.score && result.score < 0.4) // Filter for good matches
    .map(result => result.item)

  // If we found good matches in ContentData, return them
  if (contentMatches.length > 0) {
    return {
      results: contentMatches.slice(0, 5), // Limit to top 5 results
      source: 'content',
      totalResults: contentMatches.length
    }
  }

  // Fallback to ChatbotData
  const chatbotResults = chatbotFuse.search(query)
  const chatbotMatches = chatbotResults
    .filter(result => result.score && result.score < 0.4)
    .map(result => result.item)

  if (chatbotMatches.length > 0) {
    return {
      results: chatbotMatches.slice(0, 5),
      source: 'chatbot',
      totalResults: chatbotMatches.length
    }
  }

  // If no good matches found in either, return some relevant content
  const allItems = [...contentItems, ...chatbotItems]
  const allFuse = new Fuse(allItems, { ...fuseOptions, threshold: 0.6 }) // More lenient threshold
  const fallbackResults = allFuse.search(query)
  const fallbackMatches = fallbackResults
    .filter(result => result.score && result.score < 0.6)
    .map(result => result.item)

  return {
    results: fallbackMatches.slice(0, 3),
    source: 'both',
    totalResults: fallbackMatches.length
  }
}

// Generate response based on search results
export function generateResponseFromSearch(
  query: string,
  searchResults: SearchableItem[],
  chatbotData: ChatbotData
): string {
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

  // Generate response based on search results
  const topResult = searchResults[0]
  
  if (topResult.source === 'content') {
    // Format content-based response
    switch (topResult.type) {
      case 'experience':
        return `Based on my experience, I can tell you about my role as ${topResult.title}. ${topResult.content}`
      
      case 'portfolio':
        return `I worked on a project called "${topResult.title}". ${topResult.content}`
      
      case 'expertise':
        return `In terms of ${topResult.title}, ${topResult.content}`
      
      case 'training':
        return `I have training in ${topResult.title}. ${topResult.content}`
      
      case 'events':
        return `I participated in an event called "${topResult.title}". ${topResult.content}`
      
      case 'about':
        return topResult.content
      
      default:
        return topResult.content
    }
  } else {
    // Use chatbot response directly
    return topResult.content
  }
}
