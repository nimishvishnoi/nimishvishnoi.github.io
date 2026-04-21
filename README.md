# Nimish Vishnoi Portfolio

React portfolio migrated from the legacy static site to a Vite + TypeScript application.

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
yarn lint
yarn build
yarn preview
```

## Content

Portfolio content lives in `src/data/`.

- `about.ts`
- `skills.ts`
- `experience.ts`
- `education.ts`
- `projects.ts`
- `contact.ts`
- `achievements.ts`

## Resume

- Original resume download: `public/Nimish_Resume.pdf`
- Generated PDF export: `src/utils/pdf.ts`

## Notes

- The contact form requires Firebase environment variables. Use `.env.example` as the template.
- Dark mode is controlled through a persisted class-based theme toggle.
- Production build output is generated into `dist/`.
