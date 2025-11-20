# TinyLink — URL Shortener

A tiny URL shortener built for take-home assignment requirements.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Neon Postgres
- Node-postgres (pg)
- Hosted on Vercel

## Features
- Create short links (auto or custom code)
- 302 redirect
- Tracks click count and last-click time
- Delete links
- Dashboard with search, copy, stats
- Stats page for each link
- `/healthz` endpoint
- Fully public (no auth required)

## Run Locally
-npm install
-cp .env.example .env.local
-npm run dev


## Migrate Database
Run the SQL inside `/migrations/001_create_links.sql` on your Neon/Postgres database.

## Deployment
Push to GitHub → Import repo into Vercel → Add env variables → Deploy.

