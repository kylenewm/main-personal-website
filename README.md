# Kyle Newman – AI Portfolio

A Next.js 14 + TypeScript portfolio with a live voice assistant powered by the OpenAI Realtime API. It speaks about Kyle (third person), searches a structured knowledge base, and can capture contact info with validation and email alerts.

## What’s Inside
- Voice assistant (WebRTC + Realtime API) with role-aware answers (PM vs Associate DS vs Analyst)
- Knowledge-grounded search: embeddings + keyword fallback with priority weighting
- Contact capture: name + email/phone required, deduping, optional email notifications
- Health checks: `/api/health` and `/api/health/deep` (OpenAI key, realtime session, knowledge search)
- Daily cron (Vercel) hitting deep health
- UI: neural background, projects, timeline, hero with floating labels

## Stack
- Next.js 14, TypeScript, Tailwind, Framer Motion
- OpenAI Realtime API (gpt-4o-realtime-preview-2024-12-17, whisper-1)
- Nodemailer (Gmail app password) for contact alerts

## Quick Start
```bash
npm install
cp .env.example .env.local
# add your keys to .env.local (see below)
npm run dev
```

## Environment Variables
- `OPENAI_API_KEY` (required)
- `GMAIL_USER`, `GMAIL_APP_PASSWORD` (optional; email alerts for contact form)
- `ADMIN_KEY` (optional; gate contact data access)

## Key Endpoints
- `/api/realtime` — issues ephemeral Realtime tokens, system prompt + tools
- `/api/search` — embeddings search + keyword fallback (priority-weighted)
- `/api/contact` — validates name + email/phone, dedupes, emails via Nodemailer
- `/api/health` — basic ping
- `/api/health/deep` — OpenAI key check, session creation, knowledge search

## Monitoring
- Vercel cron (daily 08:00 UTC) -> `/api/health/deep`
- Add external uptime checks if needed

## Privacy / Data
- Ignored: `data/`, `transcripts/`, audio files, evaluation docs
- Contact submissions: `data/contacts.json` (runtime)

## Scripts
- `scripts/transcribe.py` — batch transcribe audio (AssemblyAI)
- `scripts/build_transcript_pipeline.py` — clean/chunk transcripts into `interview-chunks.ts`

## How It Works (voice flow)
1) Frontend requests `/api/realtime` to get an ephemeral token.
2) `VoiceClient` sets up WebRTC; server sends system prompt + tools.
3) Model always calls `search_knowledge` before answering; responses are role-aware and concise.
4) Contact flow uses `capture_contact` only after collecting & confirming name + email/phone.
5) Inactivity timer auto-disconnects to control costs.


