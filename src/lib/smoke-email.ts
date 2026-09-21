import { existsSync, readFileSync } from 'fs'

export type SmokeTestStatus = 'passed' | 'failed' | 'flaky' | 'skipped'

export type SmokeTestResult = {
  title: string
  status: SmokeTestStatus
  durationMs: number
  error?: string
}

export type SmokeReportSummary = {
  passed: number
  failed: number
  flaky: number
  skipped: number
  durationMs: number
  tests: SmokeTestResult[]
}

export type PlaywrightJsonReport = {
  suites?: PlaywrightJsonSuite[]
}

type PlaywrightJsonSuite = {
  title?: string
  specs?: PlaywrightJsonSpec[]
  suites?: PlaywrightJsonSuite[]
}

type PlaywrightJsonSpec = {
  title?: string
  ok?: boolean
  tests?: PlaywrightJsonTest[]
}

type PlaywrightJsonTest = {
  status?: string
  results?: PlaywrightJsonResult[]
}

type PlaywrightJsonResult = {
  status?: string
  duration?: number
  error?: { message?: string }
  errors?: Array<{ message?: string }>
}

export type SmokeEmailContext = {
  baseUrl: string
  runUrl?: string
  sha?: string
}

export type SmokeEmail = {
  subject: string
  html: string
  text: string
}

export function summarizePlaywrightReport(report: PlaywrightJsonReport): SmokeReportSummary {
  const tests = walkSuites(report.suites ?? [])
  return {
    passed: tests.filter((test) => test.status === 'passed').length,
    failed: tests.filter((test) => test.status === 'failed').length,
    flaky: tests.filter((test) => test.status === 'flaky').length,
    skipped: tests.filter((test) => test.status === 'skipped').length,
    durationMs: tests.reduce((sum, test) => sum + test.durationMs, 0),
    tests,
  }
}

function walkSuites(suites: PlaywrightJsonSuite[], ancestors: string[] = []): SmokeTestResult[] {
  const results: SmokeTestResult[] = []
  for (const suite of suites) {
    const path = suite.title ? [...ancestors, suite.title] : ancestors
    for (const spec of suite.specs ?? []) {
      results.push(summarizeSpec(spec, path))
    }
    results.push(...walkSuites(suite.suites ?? [], path))
  }
  return results
}

function summarizeSpec(spec: PlaywrightJsonSpec, ancestors: string[]): SmokeTestResult {
  const title = [...ancestors, spec.title].filter(Boolean).join(' › ')
  const tests = spec.tests ?? []
  const statuses = tests.map((test) => test.status)
  let status: SmokeTestStatus = 'passed'
  if (statuses.length > 0 && statuses.every((value) => value === 'skipped')) {
    status = 'skipped'
  } else if (statuses.some((value) => value === 'unexpected') || spec.ok === false) {
    status = 'failed'
  } else if (statuses.some((value) => value === 'flaky')) {
    status = 'flaky'
  }

  const results = tests.flatMap((test) => test.results ?? [])
  const durationMs = results.reduce((sum, result) => sum + (result.duration ?? 0), 0)
  const errorResult = results.find((result) => result.status === 'failed' || result.status === 'timedOut')
  const error = errorResult?.error?.message ?? errorResult?.errors?.[0]?.message
  return error ? { title, status, durationMs, error } : { title, status, durationMs }
}

export function buildSmokeEmail(summary: SmokeReportSummary, ctx: SmokeEmailContext): SmokeEmail {
  const host = hostnameOf(ctx.baseUrl)
  const shortSha = ctx.sha ? ctx.sha.slice(0, 7) : undefined
  const subject =
    summary.failed > 0
      ? `Sanity FAIL · ${host} (${summary.failed} failed)`
      : `Sanity PASS · ${host}`

  const counts = [
    `${summary.passed} passed`,
    `${summary.failed} failed`,
    `${summary.flaky} flaky`,
    `${summary.skipped} skipped`,
  ].join(', ')

  const textLines = [
    subject,
    '',
    `Target: ${ctx.baseUrl}`,
    `Results: ${counts}`,
    `Duration: ${formatDuration(summary.durationMs)}`,
    shortSha ? `Commit: ${shortSha}` : undefined,
    ctx.runUrl ? `Run: ${ctx.runUrl}` : undefined,
    '',
    ...summary.tests.map((test) => {
      const line = `${statusLabel(test.status)}  ${test.title}  (${formatDuration(test.durationMs)})`
      return test.error ? `${line}\n    ${test.error}` : line
    }),
  ].filter((line): line is string => line !== undefined)

  const rows = summary.tests
    .map((test) => {
      const error = test.error
        ? `<div style="margin-top:6px;color:#9f1239;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;white-space:pre-wrap">${escapeHtml(test.error)}</div>`
        : ''
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;vertical-align:top"><span style="color:${statusColor(test.status)};font-weight:600">${statusLabel(test.status)}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(test.title)}${error}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;color:#6b7280">${formatDuration(test.durationMs)}</td>
      </tr>`
    })
    .join('')

  const bannerColor = summary.failed > 0 ? '#9f1239' : '#047857'
  const meta = [
    ctx.runUrl
      ? `<a href="${escapeHtml(ctx.runUrl)}" style="color:#2563eb">GitHub Actions run</a>`
      : undefined,
    shortSha ? `commit ${escapeHtml(shortSha)}` : undefined,
  ]
    .filter(Boolean)
    .join(' · ')

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;color:#111827">
  <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="padding:20px 24px;background:${bannerColor};color:#ffffff">
      <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85">Post-deploy sanity</div>
      <div style="font-size:22px;font-weight:700;margin-top:4px">${escapeHtml(subject)}</div>
      <div style="margin-top:8px;opacity:0.9">${escapeHtml(ctx.baseUrl)}</div>
    </div>
    <div style="padding:16px 24px;color:#4b5563">${escapeHtml(counts)} · ${escapeHtml(formatDuration(summary.durationMs))}${meta ? ` · ${meta}` : ''}</div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead>
        <tr style="background:#f9fafb;color:#6b7280;text-align:left">
          <th style="padding:10px 12px;width:88px">Status</th>
          <th style="padding:10px 12px">Test</th>
          <th style="padding:10px 12px;text-align:right">Time</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</body>
</html>`

  return { subject, html, text: textLines.join('\n') }
}

const DEFAULT_FROM = 'Website Sanity <onboarding@resend.dev>'
const DEFAULT_TO = 'soumitra.ghosh.iit@gmail.com'
const DEFAULT_REPORT = 'smoke-results.json'
const DEFAULT_BASE_URL = 'https://soumitraghosh.in'

export type SmokeEmailCliDeps = {
  runSmokeTests?: () => void | Promise<void>
}

export async function runSmokeEmailCli(
  env: NodeJS.Dict<string> = process.env,
  deps: SmokeEmailCliDeps = {}
): Promise<{ id: string } | { skipped: true }> {
  const apiKey = env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    if (env.REQUIRE_SMOKE_EMAIL === '1') {
      throw new Error('RESEND_API_KEY is required')
    }
    console.warn('RESEND_API_KEY is not set; skipping smoke result email')
    return { skipped: true }
  }

  const from = env.RESEND_FROM?.trim() || DEFAULT_FROM
  const to = (env.RESEND_TO?.trim() || DEFAULT_TO).split(/[,;\s]+/).filter(Boolean)
  const reportPath = env.SMOKE_RESULTS_PATH?.trim() || DEFAULT_REPORT
  const baseUrl = env.BASE_URL?.trim() || DEFAULT_BASE_URL

  if (!existsSync(reportPath) && deps.runSmokeTests) {
    console.log(`No report at ${reportPath}; running smoke tests`)
    await deps.runSmokeTests()
  }

  const summary = existsSync(reportPath)
    ? summarizePlaywrightReport(JSON.parse(readFileSync(reportPath, 'utf8')))
    : {
        passed: 0,
        failed: 1,
        flaky: 0,
        skipped: 0,
        durationMs: 0,
        tests: [
          {
            title: 'Playwright report missing',
            status: 'failed' as const,
            durationMs: 0,
            error: `No report found at ${reportPath}. The smoke suite likely crashed before finishing.`,
          },
        ],
      }

  const email = buildSmokeEmail(summary, {
    baseUrl,
    runUrl: env.GITHUB_RUN_URL?.trim(),
    sha: env.GITHUB_SHA?.trim(),
  })

  const result = await sendSmokeEmail({ apiKey, from, to, ...email })
  console.log(`Sent smoke results email ${result.id} to ${to.join(', ')}`)
  return result
}

export async function sendSmokeEmail(input: {
  apiKey: string
  from: string
  to: string[]
  subject: string
  html: string
  text: string
}): Promise<{ id: string }> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend request failed: ${response.status} ${await response.text()}`)
  }

  return response.json() as Promise<{ id: string }>
}

function hostnameOf(baseUrl: string): string {
  try {
    return new URL(baseUrl).hostname
  } catch {
    return baseUrl
  }
}

function statusLabel(status: SmokeTestStatus): string {
  return status.toUpperCase()
}

function statusColor(status: SmokeTestStatus): string {
  switch (status) {
    case 'passed':
      return '#047857'
    case 'failed':
      return '#9f1239'
    case 'flaky':
      return '#b45309'
    case 'skipped':
      return '#6b7280'
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
