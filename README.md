# Soumitra Ghosh

Personal site of [Soumitra Ghosh](https://www.linkedin.com/in/soumitraghosh) — engineering leader, builder, and AI practitioner.

**Live:** [about.soumitraghosh.in](https://about.soumitraghosh.in)

## What is distinctive

- **`/now`** — a monthly status page in the [Derek Sivers](https://sive.rs/now) style: what I am working on, learning, and excited about.
- **`/spot-me`** — timezone-aware “what I’m doing right now,” mapped from a daily schedule in IST to the visitor’s local time.
- **`/ask-me`** — keyword search over the site’s own content (Fuse.js). No LLM, no API keys.
- **`/career-timeline`** — a dial view of my years of work
- **JSON-driven pages** — copy, timeline, events, and schedule live in `data/*.json`, not in React components.
- **Light / dark / ambient** — ambient follows local time (light by day, dark after 6pm).

Also: homepage (about, experience, portfolio), `/career-timeline`, and `/events`.

## Run locally

Node.js 18+.

```bash
git clone https://github.com/soumitra74/website.git
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run generate` builds a static export into `dist/` (`output: 'export'`). Push to `main` deploys on Vercel. GitHub Actions only runs post-deploy smoke tests.

## Testing

| Command | What it runs |
| --- | --- |
| `npm test` | Unit tests ([Vitest](https://vitest.dev)) for `src/lib` — timezone conversion, years of experience, data fetching |
| `npm run test:e2e` | End-to-end tests ([Playwright](https://playwright.dev), Chromium) in `e2e/`. Requires `npm run dev` on port 3000 (the pre-push hook does not start it) |
| `npm run test:smoke` | Read-only sanity checks in `smoke/` against the live site |
| `npm run test:nfr` | Non-functional checks in `nfr/` against the live site: performance budgets (TTFB, LCP, CLS, page weight), accessibility ([axe](https://github.com/dequelabs/axe-core-npm), light and dark), SEO metadata, responsive overflow, and delivery (compression, HSTS, caching). Accessibility violations are printed as warnings and don't fail the run; set `STRICT_A11Y=1` to enforce them. The hook runs the accessibility, SEO and responsive specs against `localhost:3000` |

First time only: `npx playwright install chromium`.

Both Playwright suites use the fixture in `support/diagnostics.ts`: any test that uses `page` fails if the browser logged a console error, threw an uncaught exception, had a request fail, or got an HTTP 4xx/5xx. The captured entries are attached to the test report. If a test expects such noise (for example a deliberate 404), call `diagnostics.ignore(/regex/)` in that test.

- **Pre-push hook:** `npm install` installs `.githooks/pre-push` into `.git/hooks/`, which runs the e2e suite before every push. Bypass with `SKIP_E2E=1 git push` or `git push --no-verify`.
- **Post-deploy smoke tests:** `.github/workflows/post-deploy-smoke.yml` runs `npm run test:smoke` after a successful Vercel production deployment (`vercel.deployment.success`), then emails the results through [Resend](https://resend.com). Run it immediately from the Actions tab with **Run workflow**. Vercel preview events do not start this job. To test another deployment locally: `BASE_URL=https://<preview>.vercel.app npm run test:smoke`.

  Required GitHub Actions secret: `RESEND_API_KEY`. Optional repository variables: `RESEND_FROM` (defaults to `Website Sanity <onboarding@resend.dev>`) and `RESEND_TO` (defaults to `soumitra.ghosh.iit@gmail.com`; comma-separated for multiple recipients). After verifying `soumitraghosh.in` in Resend, set `RESEND_FROM` to something like `Website Sanity <sanity@soumitraghosh.in>`. Locally, `RESEND_API_KEY=re_... npm run email:smoke` runs the smoke suite if `smoke-results.json` is missing, then emails the report.

## Edit content

| File | Feeds |
| --- | --- |
| `data/content.json` | Homepage, contact, events list |
| `data/career-timeline.json` | `/career-timeline` |
| `data/now.json` | `/now` |
| `data/daily_schedule.json` | `/spot-me` |
| `data/chatbot.json` | `/ask-me` copy and canned replies |
| `data/soumitra_content_detailed.json` | Longer about/career copy used by search |
| `data/soumitra_experience_with_dates.json` | Dated experience used by search |

`{{yearsOfExperience}}` in JSON is filled in at build/request time from a career start date.

## Stack

Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, shadcn/ui, Lucide.

## License

[MIT](LICENSE). Content and images are my personal materials; company logos and product screenshots remain the property of their owners.
