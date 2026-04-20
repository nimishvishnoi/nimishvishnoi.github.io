# Project Guidelines

## Code Style
- **TypeScript**: Use strict typing and avoid `any`. Prefer `type` imports for interfaces from `@types`.
- **React**: Use functional components with hooks. Keep components small, reusable, and accessible.
- **CSS**: Use Tailwind CSS utility classes for styling. Keep global styles in `src/styles/globals.css`.
- **Accessibility**: Use semantic HTML and proper ARIA roles. Always include `alt` text for images.

## Architecture
Modern React portfolio built with React 19, TypeScript, Vite, Tailwind CSS, and Firebase. The application uses a component-based architecture with reusable UI components, custom hooks, and centralized data files under `src/data/`.

## Build and Test
- Use `yarn install` to install dependencies.
- Run `yarn dev` for local development.
- Run `yarn build` for production.
- Use `yarn lint` and `yarn format` to enforce code quality.

## Conventions
- **Project data**: Keep content in `src/data/` files.
- **Components**: Organize by feature under `src/components/layout/`, `src/components/sections/`, and `src/components/ui/`.
- **Hooks**: Use `src/hooks/` for reusable logic such as navigation and scroll state.
- **Services**: Keep external integration in `src/services/`.
- **Utils**: Put shared helper logic in `src/utils.ts`.
- **Firebase**: Store env vars in `.env.local` and keep `.env.example` committed.

## Potential Pitfalls
- Do not reference old static site assets or jQuery patterns.
- Avoid putting business data directly in component files; use `src/data/`.
- Keep `dist/` out of source control and `.env.local` excluded.
- Ensure responsive behavior across mobile, tablet, and desktop.
- Validate contact form inputs before Firebase submission.
