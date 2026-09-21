import { mkdirSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildSmokeEmail,
  runSmokeEmailCli,
  sendSmokeEmail,
  summarizePlaywrightReport,
} from './smoke-email'

const report = {
  suites: [
    {
      title: 'pages',
      specs: [
        {
          title: '/ renders without errors',
          ok: true,
          tests: [
            {
              status: 'expected',
              results: [{ status: 'passed', duration: 1200 }],
            },
          ],
        },
        {
          title: 'unknown route returns 404',
          ok: false,
          tests: [
            {
              status: 'unexpected',
              results: [
                {
                  status: 'failed',
                  duration: 800,
                  error: { message: 'expected 404, received 200' },
                },
              ],
            },
          ],
        },
      ],
      suites: [
        {
          title: 'nested',
          specs: [
            {
              title: 'skipped check',
              ok: true,
              tests: [{ status: 'skipped', results: [{ status: 'skipped', duration: 0 }] }],
            },
            {
              title: 'flaky image load',
              ok: true,
              tests: [
                {
                  status: 'flaky',
                  results: [
                    { status: 'failed', duration: 400, error: { message: 'timeout' } },
                    { status: 'passed', duration: 350 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

describe('summarizePlaywrightReport', () => {
  it('counts passed, failed, flaky, and skipped specs from nested suites', () => {
    const summary = summarizePlaywrightReport(report)

    expect(summary).toMatchObject({
      passed: 1,
      failed: 1,
      flaky: 1,
      skipped: 1,
    })
    expect(summary.durationMs).toBe(2750)
    expect(summary.tests).toEqual([
      {
        title: 'pages › / renders without errors',
        status: 'passed',
        durationMs: 1200,
      },
      {
        title: 'pages › unknown route returns 404',
        status: 'failed',
        durationMs: 800,
        error: 'expected 404, received 200',
      },
      {
        title: 'pages › nested › skipped check',
        status: 'skipped',
        durationMs: 0,
      },
      {
        title: 'pages › nested › flaky image load',
        status: 'flaky',
        durationMs: 750,
        error: 'timeout',
      },
    ])
  })
})

describe('buildSmokeEmail', () => {
  it('builds a failing subject and includes the failed test error', () => {
    const email = buildSmokeEmail(summarizePlaywrightReport(report), {
      baseUrl: 'https://soumitraghosh.in',
      runUrl: 'https://github.com/soumitra74/website/actions/runs/1',
      sha: 'abc1234deadbeef',
    })

    expect(email.subject).toBe('Sanity FAIL · soumitraghosh.in (1 failed)')
    expect(email.text).toContain('unknown route returns 404')
    expect(email.text).toContain('expected 404, received 200')
    expect(email.text).toContain('https://soumitraghosh.in')
    expect(email.html).toContain('expected 404, received 200')
    expect(email.html).toContain('https://github.com/soumitra74/website/actions/runs/1')
    expect(email.html).toContain('abc1234')
  })

  it('builds a passing subject when every spec passed', () => {
    const email = buildSmokeEmail(
      summarizePlaywrightReport({
        suites: [
          {
            title: 'pages',
            specs: [
              {
                title: '/',
                ok: true,
                tests: [{ status: 'expected', results: [{ status: 'passed', duration: 10 }] }],
              },
            ],
          },
        ],
      }),
      { baseUrl: 'https://preview.vercel.app' }
    )

    expect(email.subject).toBe('Sanity PASS · preview.vercel.app')
    expect(email.text).toMatch(/1 passed/)
  })
})

describe('sendSmokeEmail', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  it('posts the message to the Resend emails API', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 're_123' }),
    })

    await expect(
      sendSmokeEmail({
        apiKey: 're_test',
        from: 'Sanity <onboarding@resend.dev>',
        to: ['soumitra.ghosh.iit@gmail.com'],
        subject: 'Sanity PASS · soumitraghosh.in',
        html: '<p>ok</p>',
        text: 'ok',
      })
    ).resolves.toEqual({ id: 're_123' })

    expect(fetchMock).toHaveBeenCalledWith('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer re_test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sanity <onboarding@resend.dev>',
        to: ['soumitra.ghosh.iit@gmail.com'],
        subject: 'Sanity PASS · soumitraghosh.in',
        html: '<p>ok</p>',
        text: 'ok',
      }),
    })
  })

  it('throws with the Resend status and body on failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => '{"message":"invalid api key"}',
    })

    await expect(
      sendSmokeEmail({
        apiKey: 'bad',
        from: 'Sanity <onboarding@resend.dev>',
        to: ['a@example.com'],
        subject: 'x',
        html: 'x',
        text: 'x',
      })
    ).rejects.toThrow('Resend request failed: 401 {"message":"invalid api key"}')
  })
})

describe('runSmokeEmailCli', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 're_123' }),
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('skips sending when RESEND_API_KEY is missing', async () => {
    await expect(runSmokeEmailCli({})).resolves.toEqual({ skipped: true })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fails when the API key is required but missing', async () => {
    await expect(runSmokeEmailCli({ REQUIRE_SMOKE_EMAIL: '1' })).rejects.toThrow(
      'RESEND_API_KEY is required'
    )
  })

  it('runs smoke tests when the report is missing, then emails that report', async () => {
    const reportPath = join(tmpdir(), `smoke-generated-${Date.now()}.json`)
    const runSmokeTests = vi.fn(async () => {
      writeFileSync(
        reportPath,
        JSON.stringify({
          suites: [
            {
              title: 'pages',
              specs: [
                {
                  title: '/',
                  ok: true,
                  tests: [{ status: 'expected', results: [{ status: 'passed', duration: 10 }] }],
                },
              ],
            },
          ],
        })
      )
    })

    await runSmokeEmailCli(
      {
        RESEND_API_KEY: 're_test',
        SMOKE_RESULTS_PATH: reportPath,
        BASE_URL: 'https://soumitraghosh.in',
      },
      { runSmokeTests }
    )

    expect(runSmokeTests).toHaveBeenCalledOnce()
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.subject).toBe('Sanity PASS · soumitraghosh.in')
    expect(body.text).toContain('pages › /')
  })

  it('emails a missing-report failure when Playwright did not write JSON', async () => {
    await runSmokeEmailCli({
      RESEND_API_KEY: 're_test',
      RESEND_FROM: 'Sanity <onboarding@resend.dev>',
      RESEND_TO: 'me@example.com',
      SMOKE_RESULTS_PATH: join(tmpdir(), 'missing-smoke-results.json'),
      BASE_URL: 'https://soumitraghosh.in',
    })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.to).toEqual(['me@example.com'])
    expect(body.subject).toBe('Sanity FAIL · soumitraghosh.in (1 failed)')
    expect(body.text).toContain('No report found')
  })

  it('emails the summarized Playwright report', async () => {
    const reportPath = join(tmpdir(), `smoke-results-${Date.now()}.json`)
    mkdirSync(tmpdir(), { recursive: true })
    writeFileSync(
      reportPath,
      JSON.stringify({
        suites: [
          {
            title: 'pages',
            specs: [
              {
                title: '/',
                ok: true,
                tests: [{ status: 'expected', results: [{ status: 'passed', duration: 10 }] }],
              },
            ],
          },
        ],
      })
    )

    await runSmokeEmailCli({
      RESEND_API_KEY: 're_test',
      RESEND_TO: 'a@example.com, b@example.com',
      SMOKE_RESULTS_PATH: reportPath,
      BASE_URL: 'https://preview.vercel.app',
      GITHUB_RUN_URL: 'https://github.com/soumitra74/website/actions/runs/9',
      GITHUB_SHA: 'abcdef1234567890',
    })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.from).toBe('Website Sanity <onboarding@resend.dev>')
    expect(body.to).toEqual(['a@example.com', 'b@example.com'])
    expect(body.subject).toBe('Sanity PASS · preview.vercel.app')
    expect(body.html).toContain('https://github.com/soumitra74/website/actions/runs/9')
    expect(body.html).toContain('abcdef1')
  })
})
