import Fuse from 'fuse.js'
import { ContentData } from './content'
import { ChatbotData, DetailedContentData, ExperienceWithDatesData } from './types'
import { getDetailedContent } from './content-detailed'
import { getExperienceWithDates } from './experience-dates'
import { getCareerTimelineData, CareerTimelineData } from './career-timeline'

// Interface for searchable content items
interface SearchableItem {
  id: string
  type: 'experience' | 'portfolio' | 'expertise' | 'training' | 'events' | 'about' | 'career-timeline'
  title: string
  content: string
  keywords?: string[]
  source: 'content' | 'chatbot' | 'detailed-content' | 'experience-dates' | 'career-timeline'
}

// Transform ContentData into searchable items with enhanced content
function transformContentDataToSearchableItems(contentData: ContentData): SearchableItem[] {
  const items: SearchableItem[] = []

  // Add about section with enhanced content
  if (contentData.about) {
    const journeyContent = contentData.about.content.journey.paragraphs.join(' ')
    items.push({
      id: 'about-journey',
      type: 'about',
      title: contentData.about.title,
      content: journeyContent,
      keywords: [
        'journey', 'career', 'background', 'about', 'story', 'path', 'who', 'introduction', 'yourself',
        ...journeyContent.toLowerCase().split(' ').filter(word => word.length > 3)
      ],
      source: 'content'
    })

    // Add expertise cards with enhanced keywords
    contentData.about.content.cards.forEach((card, index) => {
      const cardKeywords = [
        card.title.toLowerCase(),
        'expertise', 'skills', 'specialization', 'strength',
        ...card.description.toLowerCase().split(' ').filter(word => word.length > 3)
      ]
      
      items.push({
        id: `about-card-${index}`,
        type: 'about',
        title: card.title,
        content: card.description,
        keywords: cardKeywords,
        source: 'content'
      })
    })
  }

  // Add experience roles with enhanced content
  if (contentData.experience) {
    contentData.experience.roles.forEach((role, index) => {
      const roleContent = [role.description, role.duration].filter(Boolean).join(' ')
      // Filter out overly broad keywords that cause too many matches
      const broadKeywords = ['experience', 'work', 'job', 'position', 'role', 'career', 'team', 'product', 'company', 'business', 'technology', 'development', 'engineering', 'leadership', 'management']
      
      const roleKeywords = [
        role.title.toLowerCase(),
        role.company.toLowerCase(),
        ...roleContent.toLowerCase().split(' ').filter(word => 
          word.length > 3 && 
          !broadKeywords.includes(word) &&
          !word.match(/^(the|and|for|with|from|this|that|have|been|will|can|are|was|were)$/)
        )
      ]
      
      if (role.highlights) {
        role.highlights.forEach(highlight => {
          roleKeywords.push(highlight.name.toLowerCase(), highlight.description.toLowerCase())
        })
      }
      
      items.push({
        id: `experience-${index}`,
        type: 'experience',
        title: `${role.title} at ${role.company}`,
        content: roleContent,
        keywords: roleKeywords,
        source: 'content'
      })
    })
  }

  // Add portfolio projects with enhanced content
  if (contentData.portfolio) {
    contentData.portfolio.projects.forEach((project, index) => {
      const projectContent = `${project.description} ${project.challenge} ${project.solution} ${project.technologies.join(' ')} ${project.achievements.join(' ')}`
      const projectKeywords = [
        ...project.technologies,
        project.type.toLowerCase(),
        'project', 'portfolio', 'work', 'development', 'build',
        ...projectContent.toLowerCase().split(' ').filter(word => word.length > 3)
      ]
      
      // Add metrics as keywords
      Object.entries(project.metrics).forEach(([key, value]) => {
        projectKeywords.push(key.toLowerCase(), value.toLowerCase())
      })
      
      items.push({
        id: `portfolio-${index}`,
        type: 'portfolio',
        title: project.name,
        content: projectContent,
        keywords: projectKeywords,
        source: 'content'
      })
    })
  }

  // Add expertise areas with enhanced content
  if (contentData.expertise) {
    contentData.expertise.areas.forEach((area, index) => {
      const areaKeywords = [
        area.title.toLowerCase(),
        'expertise', 'skills', 'specialization', 'knowledge', 'proficiency',
        ...area.description.toLowerCase().split(' ').filter(word => word.length > 3)
      ]
      
      items.push({
        id: `expertise-${index}`,
        type: 'expertise',
        title: area.title,
        content: area.description,
        keywords: areaKeywords,
        source: 'content'
      })
    })
  }

  // Add training certifications with enhanced content
  if (contentData.training) {
    contentData.training.certifications.forEach((cert, index) => {
      const certContent = `${cert.description} ${cert.institution} ${cert.achievement || ''}`
      const certKeywords = [
        cert.title.toLowerCase(),
        cert.institution.toLowerCase(),
        'certification', 'training', 'education', 'course', 'learning',
        ...certContent.toLowerCase().split(' ').filter(word => word.length > 3)
      ]
      
      items.push({
        id: `training-${index}`,
        type: 'training',
        title: cert.title,
        content: certContent,
        keywords: certKeywords,
        source: 'content'
      })
    })
  }

  // Add events with enhanced content
  if (contentData.events) {
    contentData.events.events.forEach((event, index) => {
      const eventContent = `${event.description} ${event.role} ${event.institution} ${event.tags.join(' ')} ${event.highlights.join(' ')}`
      const eventKeywords = [
        ...event.tags,
        event.type.toLowerCase(),
        'event', 'speaking', 'conference', 'presentation', 'talk',
        event.role.toLowerCase(),
        event.institution.toLowerCase(),
        ...eventContent.toLowerCase().split(' ').filter(word => word.length > 3)
      ]
      
      items.push({
        id: `event-${index}`,
        type: 'events',
        title: event.title,
        content: eventContent,
        keywords: eventKeywords,
        source: 'content'
      })
    })
  }

  return items
}

// Transform DetailedContentData into searchable items
function transformDetailedContentToSearchableItems(detailedContent: DetailedContentData): SearchableItem[] {
  const items: SearchableItem[] = []

  // Add landing page introduction
  if (detailedContent.landing_page_introduction) {
    const intro = detailedContent.landing_page_introduction
    items.push({
      id: 'detailed-intro',
      type: 'about',
      title: intro.title,
      content: `${intro.intro} ${intro.body}`,
      keywords: [
        'introduction', 'overview', 'background', 'story',
        ...intro.body.toLowerCase().split(' ').filter(word => word.length > 3)
      ],
      source: 'detailed-content'
    })
  }

  // Add about me section
  if (detailedContent.about_me) {
    const about = detailedContent.about_me
    items.push({
      id: 'detailed-about',
      type: 'about',
      title: about.title,
      content: `${about.intro} ${about.body}`,
      keywords: [
        'about', 'profile', 'background', 'career', 'journey', 'who', 'introduction', 'yourself',
        ...about.body.toLowerCase().split(' ').filter(word => word.length > 3)
      ],
      source: 'detailed-content'
    })
  }

  // Add career highlights
  if (detailedContent.career_highlights) {
    detailedContent.career_highlights.roles.forEach((role, index) => {
      items.push({
        id: `detailed-career-${index}`,
        type: 'experience',
        title: role.role,
        content: role.description,
        keywords: [
          role.role.toLowerCase(),
          'career', 'highlight', 'achievement',
          ...role.description.toLowerCase().split(' ').filter(word => word.length > 3)
        ],
        source: 'detailed-content'
      })
    })
  }

  // Add thought leadership and IP
  if (detailedContent.thought_leadership_and_ip) {
    detailedContent.thought_leadership_and_ip.items.forEach((item, index) => {
      items.push({
        id: `detailed-thought-${index}`,
        type: 'expertise',
        title: item.type,
        content: item.description,
        keywords: [
          item.type.toLowerCase(),
          'thought', 'leadership', 'patent', 'research', 'innovation',
          ...item.description.toLowerCase().split(' ').filter(word => word.length > 3)
        ],
        source: 'detailed-content'
      })
    })
  }

  // Add tech stack and interests
  if (detailedContent.tech_stack_and_interests) {
    Object.entries(detailedContent.tech_stack_and_interests.skills).forEach(([key, value], index) => {
      items.push({
        id: `detailed-tech-${index}`,
        type: 'expertise',
        title: key,
        content: value,
        keywords: [
          key.toLowerCase(),
          'tech', 'stack', 'skills', 'technology', 'tools',
          ...value.toLowerCase().split(' ').filter(word => word.length > 3)
        ],
        source: 'detailed-content'
      })
    })
  }

  // Add beyond work activities
  if (detailedContent.beyond_work) {
    detailedContent.beyond_work.activities.forEach((activity, index) => {
      items.push({
        id: `detailed-activity-${index}`,
        type: 'about',
        title: 'Personal Activity',
        content: activity,
        keywords: [
          'personal', 'hobby', 'interest', 'activity', 'life',
          ...activity.toLowerCase().split(' ').filter(word => word.length > 3)
        ],
        source: 'detailed-content'
      })
    })
  }

  return items
}

// Transform ExperienceWithDatesData into searchable items
function transformExperienceWithDatesToSearchableItems(experienceDates: ExperienceWithDatesData): SearchableItem[] {
  const items: SearchableItem[] = []

  experienceDates.sections.forEach((section, index) => {
    const content = `${section.summary} ${section.highlights.join(' ')}`
    const keywords = [
      section.company.toLowerCase(),
      section.title.toLowerCase(),
      section.location.toLowerCase(),
      'experience', 'role', 'position', 'work',
      ...content.toLowerCase().split(' ').filter(word => word.length > 3)
    ]

    items.push({
      id: `experience-dates-${index}`,
      type: 'experience',
      title: `${section.title} at ${section.company}`,
      content: content,
      keywords: keywords,
      source: 'experience-dates'
    })
  })

  return items
}

// Transform CareerTimelineData into searchable items
function transformCareerTimelineToSearchableItems(careerTimeline: CareerTimelineData): SearchableItem[] {
  const items: SearchableItem[] = []

  // Iterate through the projects object by year
  Object.entries(careerTimeline.projects).forEach(([year, project]) => {
    const content = `${project.title} ${project.description} ${project.techStack.join(' ')} ${project.achievements.join(' ')}`
    const keywords = [
      project.title.toLowerCase(),
      year,
      'career', 'timeline', 'experience', 'role', 'position', 'work', 'project',
      ...project.techStack.map(tech => tech.toLowerCase()),
      ...project.achievements.map(achievement => achievement.toLowerCase()),
      ...content.toLowerCase().split(' ').filter(word => word.length > 3)
    ]

    items.push({
      id: `career-timeline-${year}`,
      type: 'career-timeline',
      title: project.title,
      content: content,
      keywords: keywords,
      source: 'career-timeline'
    })
  })

  return items
}

// Transform ChatbotData into searchable items with enhanced keywords
function transformChatbotDataToSearchableItems(chatbotData: ChatbotData): SearchableItem[] {
  const items: SearchableItem[] = []

  // Add context-aware responses with enhanced keywords
  Object.entries(chatbotData.responses.context_aware).forEach(([key, context]) => {
    const enhancedKeywords = [
      ...context.keywords,
      key.toLowerCase(),
      ...context.response.toLowerCase().split(' ').filter(word => word.length > 3)
    ]
    
    items.push({
      id: `chatbot-${key}`,
      type: 'about' as any, // Using 'about' as default type for chatbot items
      title: key,
      content: context.response,
      keywords: enhancedKeywords,
      source: 'chatbot'
    })
  })

  return items
}

// Fuse.js options for fuzzy searching - optimized for better accuracy
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'content', weight: 0.5 },
    { name: 'keywords', weight: 0.3 },
    { name: 'type', weight: 0.1 }
  ],
  threshold: 0.3, // Lower threshold = more strict matching
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true,
  findAllMatches: true,
  useExtendedSearch: true, // Enable extended search features
  ignoreLocation: true, // Ignore location of matches for better results
  distance: 200 // Allow matches at greater distance
}

// Words dropped from queries before matching
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were',
  'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can',
  'what', 'when', 'where', 'why', 'how', 'tell', 'me', 'about', 'your', 'you', 'any', 'know', 'there', 'ever', 'its',
  'his', 'her', 'this', 'that', 'it', 'my', 'worked', 'working', 'spoken',
])

function rawTokens(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
}

function normalizeToken(word: string): string {
  return word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word
}

function queryTerms(query: string): string[] {
  const words = rawTokens(query).filter(word => word.length > 2 && !STOP_WORDS.has(word))
  return Array.from(new Set(words.map(normalizeToken)))
}

// Most query terms must match, so one shared word ("computing") cannot pull in an unrelated item
function hasCoverage(matched: number, total: number): boolean {
  return total === 1 ? matched >= 1 : matched * 2 > total
}

function itemWords(item: SearchableItem) {
  const title = new Set(rawTokens(item.title).map(normalizeToken))
  const keywords = new Set((item.keywords ?? []).flatMap(rawTokens).map(normalizeToken))
  const content = new Set(rawTokens(item.content).map(normalizeToken))
  return { title, keywords, content, all: new Set(Array.from(title).concat(Array.from(keywords), Array.from(content))) }
}

function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = curr
  }
  return prev[b.length]
}

// Exact term hits, weighted by where they occur: title > keywords > content
function rankByTermMatch(terms: string[], items: SearchableItem[]): SearchableItem[] {
  return items
    .map((item, index) => {
      const { title, keywords, content } = itemWords(item)
      let score = 0
      let matched = 0
      for (const term of terms) {
        const hit = title.has(term) || keywords.has(term) || content.has(term)
        if (hit) matched++
        score += (title.has(term) ? 3 : 0) + (keywords.has(term) ? 2 : 0) + (content.has(term) ? 1 : 0)
      }
      return { item, index, score, matched }
    })
    .filter(entry => entry.score > 0 && hasCoverage(entry.matched, terms.length))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(entry => entry.item)
}

// Ensure result diversity by avoiding repeated content types
function ensureResultDiversity(results: SearchableItem[], maxPerType: number = 1): SearchableItem[] {
  const typeCounts: { [key: string]: number } = {}
  const diverseResults: SearchableItem[] = []

  for (const result of results) {
    const type = result.type
    if (!typeCounts[type]) {
      typeCounts[type] = 0
    }

    if (typeCounts[type] < maxPerType) {
      diverseResults.push(result)
      typeCounts[type]++
    }
  }

  return diverseResults
}

// Main search: exact term ranking, then fuzzy, then chatbot canned answers; no match returns no results
export async function searchContent(
  query: string,
  contentData: ContentData,
  chatbotData: ChatbotData
): Promise<{
  results: SearchableItem[]
  source: 'content' | 'chatbot' | 'both' | 'detailed-content' | 'experience-dates' | 'career-timeline'
  totalResults: number
}> {
  if (!query.trim()) {
    return { results: [], source: 'content', totalResults: 0 }
  }

  const terms = queryTerms(query)

  const contentItems = transformContentDataToSearchableItems(contentData)
  const chatbotItems = transformChatbotDataToSearchableItems(chatbotData)

  let detailedContentItems: SearchableItem[] = []
  let experienceDatesItems: SearchableItem[] = []
  let careerTimelineItems: SearchableItem[] = []

  try {
    const [detailedContent, experienceDates, careerTimeline] = await Promise.all([
      getDetailedContent(),
      getExperienceWithDates(),
      getCareerTimelineData()
    ])

    detailedContentItems = transformDetailedContentToSearchableItems(detailedContent)
    experienceDatesItems = transformExperienceWithDatesToSearchableItems(experienceDates)
    careerTimelineItems = transformCareerTimelineToSearchableItems(careerTimeline)
  } catch (error) {
    console.error('Error fetching additional data sources:', error)
  }

  const siteItems = [...contentItems, ...detailedContentItems, ...experienceDatesItems, ...careerTimelineItems]

  const exactMatches = rankByTermMatch(terms, siteItems)
  if (exactMatches.length > 0) {
    return {
      results: ensureResultDiversity(exactMatches, 1).slice(0, 3),
      source: 'content',
      totalResults: exactMatches.length
    }
  }

  const fuzzyFuse = new Fuse(siteItems, fuseOptions)
  const fuzzyHits = new Map<SearchableItem, Set<string>>()
  for (const term of terms.filter(term => term.length >= 4)) {
    const maxDistance = term.length > 6 ? 2 : 1
    for (const result of fuzzyFuse.search(term)) {
      if (result.score === undefined || result.score >= fuseOptions.threshold) continue
      const words = Array.from(itemWords(result.item).all)
      if (!words.some(word => word.length >= 5 && editDistance(word, term) <= maxDistance)) continue
      fuzzyHits.set(result.item, (fuzzyHits.get(result.item) ?? new Set<string>()).add(term))
    }
  }
  const fuzzyMatches = Array.from(fuzzyHits)
    .filter(([, hits]) => hasCoverage(hits.size, terms.length))
    .map(([item]) => item)
  if (fuzzyMatches.length > 0) {
    return {
      results: ensureResultDiversity(fuzzyMatches, 1).slice(0, 3),
      source: 'content',
      totalResults: fuzzyMatches.length
    }
  }

  const chatbotMatches = rankByTermMatch(terms, chatbotItems)
  if (chatbotMatches.length > 0) {
    return {
      results: chatbotMatches.slice(0, 3),
      source: 'chatbot',
      totalResults: chatbotMatches.length
    }
  }

  return { results: [], source: 'both', totalResults: 0 }
}

// Generate response based on search results with improved variety
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
  
  if (topResult.source === 'content' || topResult.source === 'detailed-content' || topResult.source === 'experience-dates' || topResult.source === 'career-timeline') {
    // Format content-based response with more variety
    switch (topResult.type) {
      case 'experience':
        const experienceResponses = [
          `I worked as ${topResult.title}. ${topResult.content}`,
          `During my time at ${topResult.title.split(' at ')[1] || 'this role'}, ${topResult.content}`,
          `My experience includes ${topResult.title}. ${topResult.content}`
        ]
        return experienceResponses[Math.floor(Math.random() * experienceResponses.length)]
      
      case 'portfolio':
        const portfolioResponses = [
          `I developed "${topResult.title}". ${topResult.content}`,
          `One of my key projects was "${topResult.title}". ${topResult.content}`,
          `I built "${topResult.title}" which involved ${topResult.content}`
        ]
        return portfolioResponses[Math.floor(Math.random() * portfolioResponses.length)]
      
      case 'expertise':
        const expertiseResponses = [
          `I specialize in ${topResult.title}. ${topResult.content}`,
          `My expertise includes ${topResult.title}. ${topResult.content}`,
          `In ${topResult.title}, ${topResult.content}`
        ]
        return expertiseResponses[Math.floor(Math.random() * expertiseResponses.length)]
      
      case 'training':
        const trainingResponses = [
          `I'm certified in ${topResult.title}. ${topResult.content}`,
          `I completed training in ${topResult.title}. ${topResult.content}`,
          `My education includes ${topResult.title}. ${topResult.content}`
        ]
        return trainingResponses[Math.floor(Math.random() * trainingResponses.length)]
      
      case 'events':
        const eventResponses = [
          `I spoke at "${topResult.title}". ${topResult.content}`,
          `I participated in "${topResult.title}". ${topResult.content}`,
          `I was involved in "${topResult.title}". ${topResult.content}`
        ]
        return eventResponses[Math.floor(Math.random() * eventResponses.length)]
      
      case 'about':
        return topResult.content
      
      case 'career-timeline':
        const timelineResponses = [
          `In ${topResult.title}, I worked on ${topResult.content}`,
          `My career timeline includes ${topResult.title}. ${topResult.content}`,
          `During my career, I was involved in ${topResult.title}. ${topResult.content}`
        ]
        return timelineResponses[Math.floor(Math.random() * timelineResponses.length)]
      
      default:
        return topResult.content
    }
  } else {
    // Use chatbot response directly
    return topResult.content
  }
}
