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
