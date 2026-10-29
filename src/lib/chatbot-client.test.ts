import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { generateResponse, getChatbotContent } from './chatbot-client'
import { getContent } from './content'
import { generateResponseFromSearch, searchContent } from './search'
import type { ChatbotData } from './types'

vi.mock('./search', () => ({
  searchContent: vi.fn(),
  generateResponseFromSearch: vi.fn(),
}))

vi.mock('./content', () => ({
  getContent: vi.fn(),
}))

const chatbotData = {
  responses: {
    context_aware: {
      experience: { keywords: ['experience', 'career'], response: 'Context: experience' },
      contact: { keywords: ['email'], response: 'Context: contact' },
    },
    default: ['Default A', 'Default B'],
  },
} as unknown as ChatbotData

const contentData = { marker: 'content' } as never

describe('getChatbotContent', () => {
  const fetchMock = vi.fn()
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    delete process.env.NEXT_PUBLIC_BASE_URL
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (originalBaseUrl === undefined) delete process.env.NEXT_PUBLIC_BASE_URL
    else process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl
  })

  it('fetches /api/chatbot from localhost by default and returns JSON', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => chatbotData })

    await expect(getChatbotContent()).resolves.toBe(chatbotData)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/chatbot', {
      cache: 'no-store',
    })
  })

  it('throws with the status code on a non-OK response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 })

    await expect(getChatbotContent()).rejects.toThrow('Failed to fetch chatbot content: 503')
  })
})

describe('generateResponse', () => {
  beforeEach(() => {
    vi.mocked(searchContent).mockReset()
    vi.mocked(generateResponseFromSearch).mockReset()
    vi.mocked(getContent).mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds the reply from search results using the supplied content', async () => {
    const results = [{ id: 1 }]
    vi.mocked(searchContent).mockResolvedValue({ results } as never)
    vi.mocked(generateResponseFromSearch).mockReturnValue('searched reply')

    await expect(generateResponse('tell me', chatbotData, contentData)).resolves.toBe(
      'searched reply'
    )
    expect(getContent).not.toHaveBeenCalled()
    expect(searchContent).toHaveBeenCalledWith('tell me', contentData, chatbotData)
    expect(generateResponseFromSearch).toHaveBeenCalledWith('tell me', results, chatbotData)
  })

  it('loads content itself when none is supplied', async () => {
    vi.mocked(getContent).mockResolvedValue(contentData)
    vi.mocked(searchContent).mockResolvedValue({ results: [] } as never)
    vi.mocked(generateResponseFromSearch).mockReturnValue('reply')

    await generateResponse('hi', chatbotData)
    expect(getContent).toHaveBeenCalledOnce()
    expect(searchContent).toHaveBeenCalledWith('hi', contentData, chatbotData)
  })

  it('falls back to a keyword-matched context response when search fails', async () => {
    vi.mocked(searchContent).mockRejectedValue(new Error('index unavailable'))

    await expect(
      generateResponse('What is your CAREER like?', chatbotData, contentData)
    ).resolves.toBe('Context: experience')
    expect(console.error).toHaveBeenCalled()
  })

  it('falls back to a random default response when no keyword matches', async () => {
    vi.mocked(searchContent).mockRejectedValue(new Error('index unavailable'))
    const random = vi.spyOn(Math, 'random')

    random.mockReturnValue(0)
    await expect(generateResponse('unrelated', chatbotData, contentData)).resolves.toBe('Default A')

    random.mockReturnValue(0.99)
    await expect(generateResponse('unrelated', chatbotData, contentData)).resolves.toBe('Default B')
  })
})
