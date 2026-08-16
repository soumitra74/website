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

`npm run generate` builds a static export into `dist/` (`output: 'export'`). Push to `main` deploys via GitHub Actions.

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
