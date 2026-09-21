import { expect, test } from '@playwright/test'

const endpoints = [
  '/api/content',
  '/api/content-detailed',
  '/api/experience-dates',
  '/api/career-timeline',
  '/api/chatbot',
  '/api/daily-schedule',
  '/api/now',
]

for (const endpoint of endpoints) {
  test(`GET ${endpoint} returns JSON`, async ({ request }) => {
    const response = await request.get(endpoint)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/json')
    expect(await response.json()).toBeTruthy()
  })
}

test('/api/content interpolates years of experience', async ({ request }) => {
  const body = await (await request.get('/api/content')).text()
  expect(body).not.toContain('{{yearsOfExperience}}')
})
