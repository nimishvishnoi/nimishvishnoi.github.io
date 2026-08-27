# AI Agent Instructions for Nimish Vishnoi Portfolio

## Project Overview

This is a **production-grade personal portfolio website** for a Staff Engineer, built with modern frontend technologies and Firebase backend. The site features a responsive multi-section layout (About, Skills, Projects, Resume, Contact) with admin capabilities for content management without requiring code redeploys.

**Key URLs**:

- Production: https://nimishvishnoi.github.io
- Repository: https://github.com/nimishvishnoi/nimishvishnoi.github.io

## Quick Start Commands

```bash
# Development
yarn dev              # Start dev server on port 3000

# Building & Deployment
yarn build            # TypeScript check + Vite build
yarn preview          # Preview production build locally

# Code Quality
yarn lint             # ESLint check
yarn lint:fix         # Auto-fix linting issues
yarn format           # Prettier formatting
yarn format:check     # Check formatting without modifying
yarn check:csp        # Validate CSP hash for inline scripts

# Testing
yarn test             # Run unit tests
yarn test:ui          # Visual test runner
yarn test:coverage    # Generate coverage report
yarn test:watch       # Watch mode for development
```

## Project Structure & Key Patterns

### Architecture Overview

```
src/
├── components/        # React components (feature-based organization)
│   ├── admin/        # Admin panel features (authenticated)
│   ├── layout/       # Header, navigation, scroll buttons
│   ├── sections/     # Main portfolio sections (About, Skills, Projects, etc.)
│   ├── ui/           # Reusable UI components (Button, Card, Badge, Toast)
│   ├── App.tsx       # Main app with routing/state wiring
│   └── ErrorBoundary.tsx
├── data/             # Portfolio content (Single Source of Truth)
│   ├── site-content.json  # Canonical editable source
│   ├── *.ts           # Type-safe re-exports of JSON
│   └── index.ts       # Convenience exports
├── services/         # External integrations (Firebase, analytics, content)
├── hooks/            # Custom React hooks (state, effects, caching)
├── locales/          # Internationalization (i18next)
├── utils/            # Helper functions (env parsing, PDF generation, SEO)
├── types/            # TypeScript type definitions
└── styles/           # Global CSS
```

### Component Organization Patterns

**Section Components** (`src/components/sections/`):

- Export default React.FC component
- Use Framer Motion for entrance animations
- Follow naming: `<SectionName>Section.tsx`
- Example: [AboutSection.tsx](src/components/sections/AboutSection.tsx), [ContactSection.tsx](src/components/sections/ContactSection.tsx)

**UI Components** (`src/components/ui/`):

- Reusable, composable components
- Tailwind CSS for styling
- Accept `className` prop for customization
- Example: [Card.tsx](src/components/ui/Card.tsx), [Button.tsx](src/components/ui/Button.tsx)

**Admin Components** (`src/components/admin/`):

- Require admin authentication check
- Connected to Firestore for content updates
- Example: [ContentEditor.tsx](src/components/admin/ContentEditor.tsx), [MessagesViewer.tsx](src/components/admin/MessagesViewer.tsx)

### Data & Content Pattern

**Single Source of Truth (SSoT)**:

1. **Canonical source**: [src/data/site-content.json](src/data/site-content.json) — human-editable JSON
2. **TypeScript re-exports**: Individual `.ts` files import JSON, provide type safety
3. **Runtime fallback strategy**:
   - Primary: Firestore (admin-editable, no rebuild needed)
   - Secondary: site-content.json (offline-safe)
   - Tertiary: TS files (compile-time safety)

See [src/services/content.ts](src/services/content.ts) for the content service with fallback logic.

### Styling & Theming

- **Framework**: Tailwind CSS 4 with PostCSS
- **Dark Mode**: Class-based (`dark:` prefix), persisted to localStorage
- **Animations**: Framer Motion for component animations, custom Tailwind animations for fade-in/slide-in
- **Custom config**: [tailwind.config.ts](tailwind.config.ts) includes animation extensions

### State Management

- **Global state**: [useAppState.tsx](src/hooks/useAppState.tsx) uses `useReducer` pattern
- **Local state**: Individual custom hooks for specific concerns (dark mode, scroll spy, mobile nav)
- **Caching**: Content hook includes built-in caching to avoid re-fetches
- **localStorage**: Dark mode, language preference, form data persistence

### Type Safety

- **Strict TypeScript**: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- **Central types**: [src/types/index.ts](src/types/index.ts) defines major interfaces (Skill, Achievement, Experience, etc.)
- **No `any`**: Avoid `any` types; use proper TypeScript definitions

## Firebase & Environment Setup

### Configuration

Firebase config is loaded from **environment variables** following this pattern:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_RECAPTCHA_SITE_KEY=... (optional)
```

**Placeholder Detection**: Values like `your_api_key` or `replace_*` are treated as disabled/placeholder.

### Security Rules

- **Realtime Database**: [database.rules.json](database.rules.json) — validates contact form submissions
  - Server-side field validation (name, email, phone, subject, message)
  - Timestamp validation against server time (prevents tampering)
  - reCAPTCHA token storage (optional)
- **Cloud Firestore**: [firestore.rules](firestore.rules) — controls access to portfolio content
  - Public read access for portfolio content
  - Admin-only writes with isAdmin check
  - Analytics events: client write, admin read

See README.md [Contact Form Security](README.md#contact-form-security) section for details.

## Development Conventions

### Naming Conventions

- **Files**: PascalCase for components (`MyComponent.tsx`), camelCase for utilities/hooks (`useMyHook.ts`)
- **Functions/Types**: PascalCase for types and interfaces, camelCase for functions
- **IDs**: Use hyphenated lowercase for HTML IDs and data attributes
- **Constants**: UPPER_SNAKE_CASE for true constants

### Import Patterns

- **Use path aliases** from [vite.config.ts](vite.config.ts):
  ```typescript
  import { Button } from '@components/ui'; // ✅ Use aliases
  import { useAppState } from '@hooks'; // ✅ Shorter, cleaner
  import type { Skill } from '@types'; // ✅ Use type imports
  ```
- **Organize imports**: Types first, then external packages, then local imports
- **Use `index.ts` barrel exports** to keep import paths clean

### React Best Practices

- **Functional components only**: No class components
- **Custom hooks for side effects**: Extract complexity into hooks
- **Memoization**: Use `React.memo()` for expensive computations, `useMemo()` for derived state
- **Error boundaries**: Wrap top-level components with [ErrorBoundary.tsx](src/components/ErrorBoundary.tsx)
- **Accessibility**: Include `aria-*` attributes, semantic HTML, keyboard navigation

### Type Safety

- Import types separately: `import type { MyType } from '@types'`
- Define interfaces at the top of files before usage
- Avoid unions in component props; create specific interfaces instead
- Use `as const` for readonly arrays/objects where appropriate

### Testing

- **Test framework**: Vitest with React Testing Library
- **Test location**: `.test.ts` or `.test.tsx` files colocated with source
- **Naming pattern**: Describe the component/function, not the test
- **Good examples**: [ErrorBoundary.test.tsx](src/components/ErrorBoundary.test.tsx), [seo.test.ts](src/utils/seo.test.ts)

## Common Pitfalls & Gotchas

### Firebase Issues

- ❌ **Placeholder env vars**: If `VITE_FIREBASE_API_KEY` is set to a placeholder value (e.g., `your_api_key`), Firebase will appear configured but requests will fail silently. Check [env.ts](src/utils/env.ts) for placeholder detection logic.
- ❌ **Missing FIREBASE_TOKEN**: When deploying `database.rules.json` via GitHub Actions, the `FIREBASE_TOKEN` secret must be set.
- ✅ **Graceful degradation**: Contact form degrades gracefully when Firebase is disabled; portfolio still loads.

### Build Issues

- ❌ **TypeScript strict mode**: The build fails if there are unused variables/parameters. Run `yarn lint:fix` to auto-fix.
- ❌ **CSP hash mismatch**: If inline scripts change, run `yarn check:csp` to generate new hashes for [index.html](index.html).
- ✅ **Code splitting**: Vite automatically chunks React, Framer Motion, and PDF vendors to optimize load time.

### Content Management

- ⚠️ **Admin-editable content**: Changes in Firestore don't require rebuilds, but the site must be refreshed (hard refresh to clear cache).
- ⚠️ **Fallback priority**: If Firestore has stale data, check the fallback chain: Firestore → site-content.json → TS files.
- ✅ **Seed data**: Use [SeedFirestore.tsx](src/components/admin/SeedFirestore.tsx) to populate initial Firestore data.

### Mobile & Responsive

- ❌ **Hardcoded breakpoints**: Use Tailwind's responsive modifiers (`md:`, `lg:`, etc.) instead.
- ✅ **Mobile navigation**: [MobileNav.tsx](src/components/layout/MobileNav.tsx) handles menu toggle; test on actual mobile devices.

### Performance

- ❌ **Unoptimized images**: No `Image` optimization currently; use optimized JPG/PNG files.
- ⚠️ **Analytics logging**: Heavy analytics events can slow down interactions; debounce if necessary.
- ✅ **Tree-shaking**: Vite automatically removes unused code; don't add unnecessary dependencies.

## Key Files & When to Edit

| File                                                     | Purpose                     | When to Edit                                         |
| -------------------------------------------------------- | --------------------------- | ---------------------------------------------------- |
| [src/data/site-content.json](src/data/site-content.json) | Canonical portfolio content | Adding/updating about, skills, projects, experience  |
| [src/components/sections/](src/components/sections/)     | Main portfolio sections     | Changing layout or adding new sections               |
| [firestore.rules](firestore.rules)                       | Content access control      | Changing admin permissions or adding new collections |
| [database.rules.json](database.rules.json)               | Contact form validation     | Updating form submission rules or field validation   |
| [tailwind.config.ts](tailwind.config.ts)                 | Tailwind customization      | Adding custom colors, animations, or breakpoints     |
| [vite.config.ts](vite.config.ts)                         | Build configuration         | Changing bundle chunks, dev server port, or aliases  |
| [tsconfig.json](tsconfig.json)                           | TypeScript options          | Only if changing type checking or compilation target |

## Deployment & CI/CD

### GitHub Pages Deployment

- Configured via `.github/workflows/deploy.yml`
- Triggered on push to `main` branch
- Requires environment secrets in GitHub (see [README.md Deployment](README.md#deployment) section)
- Build output: `dist/` directory
- Production URL: https://nimishvishnoi.github.io

### Local Testing

```bash
yarn build          # Create production build
yarn preview        # Serve dist/ locally on http://localhost:4173
```

## Language & i18n

- **Framework**: i18next with React integration
- **Translations**: [src/locales/translations.json](src/locales/translations.json)
- **Auto-detection**: Browser language detected automatically
- **Usage**: Import `useTranslation()` hook to access translations in components

## Analytics & Tracking

- **Service**: [src/services/analytics.ts](src/services/analytics.ts)
- **Events tracked**: Page views (by section), form submissions, project clicks, resume downloads
- **Storage**: Firestore collection `analytics`
- **Scope**: Admin-readable for tracking user engagement

## Debugging Tips

1. **React DevTools**: Install React DevTools browser extension
2. **Vite HMR**: Hot Module Replacement works automatically in dev mode
3. **TypeScript errors**: Run `yarn build` to check for type errors during development
4. **Firebase issues**: Check browser console for Firebase error messages
5. **Dark mode**: Check localStorage `theme` key to verify persistence
6. **i18n**: Check localStorage `i18nextLng` for language preference

## Asking for Help

When working with this codebase, consider:

- Is this a **frontend UI** change? → Focus on [src/components/](src/components/)
- Is this a **content** change? → Update [src/data/site-content.json](src/data/site-content.json) or Firestore
- Is this a **security** issue? → Review [firestore.rules](firestore.rules) and [database.rules.json](database.rules.json)
- Is this a **build/deployment** issue? → Check [vite.config.ts](vite.config.ts) and `.github/workflows/`
- Is this a **type error**? → Check [src/types/index.ts](src/types/index.ts) and run `yarn build`

## Additional Resources

- [README.md](README.md) — Setup, deployment, Firebase security details
- [vite.config.ts](vite.config.ts) — Build configuration and chunk splitting
- [tsconfig.json](tsconfig.json) — TypeScript configuration and path aliases
- [tailwind.config.ts](tailwind.config.ts) — Tailwind extensions and animation definitions
