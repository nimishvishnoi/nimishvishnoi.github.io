# Nimish Vishnoi Portfolio

Personal portfolio built with React, TypeScript, Vite, Tailwind CSS, and Firebase.

## Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Framer Motion
- React Hook Form + Zod
- Firebase Realtime Database

## Scripts

```bash
yarn dev
yarn format:check
yarn lint
yarn check:csp
yarn build
yarn preview
```

## Content

Portfolio content is maintained in `src/data/`.

- `about.ts`
- `skills.ts`
- `experience.ts`
- `education.ts`
- `projects.ts`
- `contact.ts`
- `achievements.ts`

## Resume

- Static resume download: `public/Nimish_Resume.pdf`
- Generated resume export: `src/utils/pdf.ts`
- Social preview image: `public/og-image.jpg`

## Contact Form Security

- Firebase config is read from `VITE_FIREBASE_*` variables.
- Placeholder values from `.env.example` are treated as disabled config.
- Submissions are validated in the browser and again by `database.rules.json`.
- reCAPTCHA v3 is optional through `VITE_RECAPTCHA_SITE_KEY`; tokens are not stored.
- The frontend keeps only local rate-limit timestamps and does not send a device fingerprint.

## Deployment

- Local development:
  1. Copy `.env.example` to `.env.local`
  2. Fill in Firebase `VITE_FIREBASE_*` values
  3. Run `yarn dev`
- Production build: `yarn build`
- Deployment is handled through GitHub Pages via `.github/workflows/deploy.yml`.
- Required GitHub Actions secrets:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_DATABASE_URL`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID`
  - `VITE_RECAPTCHA_SITE_KEY` (optional)
  - `FIREBASE_TOKEN` (only needed when deploying `database.rules.json`)
- Production output is generated into `dist/`.

  <!-- CI trigger: no-op commit to deploy updated Firebase rules -->

## Personal AI Portfolio Assistant

The Cloudflare Worker for the portfolio assistant is in [`worker/`](worker/).
Its editable, markdown-based context index is [`worker/context/llms.txt`](worker/context/llms.txt),
with profile, project, and skill content in
[`worker/context/profile.md`](worker/context/profile.md),
[`worker/context/projects.md`](worker/context/projects.md), and
[`worker/context/skills.md`](worker/context/skills.md).
The deployed endpoint is
`https://nimish-portfolio-assistant.nnimish75.workers.dev`.

From the `worker/` directory:

```bash
npm install
npm run typecheck
npm run dev
npm run deploy
```

The Worker uses the native Cloudflare Workers AI binding with
`@cf/openai/gpt-oss-20b` to turn retrieved portfolio context into concise,
natural-language answers. No model API key is exposed to the frontend or
required in GitHub Actions. An OpenAI-compatible provider can still be used by
configuring `AI_API_KEY` and `AI_API_URL` as Worker secrets. If neither provider
is available, the endpoint falls back to deterministic context retrieval.
`ALLOWED_ORIGIN` defaults to `https://nimishvishnoi.github.io` and should remain
restricted to the deployed portfolio origin. The Worker enforces JSON requests,
a bounded 10-request-per-minute per-client limit, a 10-second external-provider
timeout, and a maximum provider response size. These controls are intentionally
in-memory and free-tier compatible; Cloudflare Rate Limiting or Durable Objects
can provide stronger global enforcement later if traffic requires it.

The first administrator must be provisioned outside the public application
(for example, through the Firebase console). The public app cannot create the
first administrator or grant itself administrator access.

The `Deploy Cloudflare Worker` GitHub Actions job runs on pushes to `main`.
Add these repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token with Workers Scripts edit permission
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID
- `VITE_ASSISTANT_API_URL` — `https://nimish-portfolio-assistant.nnimish75.workers.dev`
