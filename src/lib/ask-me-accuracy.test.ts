import { describe, expect, it, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import { searchContent, generateResponseFromSearch } from './search'
import { interpolateYearsOfExperience } from './years-of-experience'
import type { ChatbotData } from './types'

const read = (f: string) => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', f), 'utf8'))

vi.mock('./content-detailed', async () => {
  const fs = await import('fs')
  const path = await import('path')
  return {
    getDetailedContent: async () =>
      JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'soumitra_content_detailed.json'), 'utf8')),
  }
})
vi.mock('./experience-dates', async () => {
  const fs = await import('fs')
  const path = await import('path')
  return {
    getExperienceWithDates: async () =>
      JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'soumitra_experience_with_dates.json'), 'utf8')),
  }
})
vi.mock('./career-timeline', async () => {
  const fs = await import('fs')
  const path = await import('path')
  return {
    getCareerTimelineData: async () =>
      JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'career-timeline.json'), 'utf8')),
  }
})

const content = interpolateYearsOfExperience(read('content.json'))
const chatbot = read('chatbot.json') as ChatbotData

const fallbackReplies = new Set<string>([
  ...chatbot.responses.default,
  ...Object.values(chatbot.responses.context_aware).map(c => c.response),
])

async function ask(q: string) {
  const r = await searchContent(q, content, chatbot)
  return generateResponseFromSearch(q, r.results, chatbot)
}

// Questions whose answer is in the site data: the reply must mention the key fact.
const answerable: Array<[string, string | RegExp]> = [
  ['What is your experience with cloud?', 'cloud'],
  ['Do you know Kubernetes?', 'Kubernetes'],
  ['Have you worked with AWS?', 'AWS'],
  ['Any certifications?', 'Certification'],
  ['Have you spoken at events?', /Product Tank|DataDog Live/],
  ['Who are you?', 'years of experience'],
  ['When did you work in Seedling Labs?', /Apr 2026.*Jul 2026/],
]

// Questions with no answer in the site data: the reply must be a canned fallback, not an unrelated item.
const unanswerable = ['Do you know Azure?', 'What do you think about blockchain?', 'quantum computing', 'xyzzy']

describe('ask-me answer accuracy', () => {
  describe('answerable questions mention the key fact', () => {
    it.each(answerable)('%s -> mentions %s', async (q, term) => {
      const reply = await ask(q)
      if (typeof term === 'string') expect(reply).toContain(term)
      else expect(reply).toMatch(term)
    })
  })

  describe('unanswerable questions get a fallback reply', () => {
    it.each(unanswerable)('%s -> fallback', async q => {
      expect(fallbackReplies.has(await ask(q))).toBe(true)
    })
  })

  it('contact question gets the contact reply, not an unrelated project', async () => {
    const reply = await ask('What is your email?')
    expect(reply).toBe(chatbot.responses.context_aware.contact?.response ?? reply)
    expect(reply).not.toMatch(/CES|Entropik|RazorpayX/)
  })

  it('never leaks template placeholders', async () => {
    const queries = [...answerable.map(([q]) => q), ...unanswerable, 'about you', 'experience']
    for (const q of queries) {
      expect(await ask(q), q).not.toMatch(/\{\{|\}\}/)
    }
  })
})
