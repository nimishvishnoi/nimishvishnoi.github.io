---
description: "Use when editing TypeScript/React files to enforce modern React + TypeScript patterns."
applyTo: "src/**/*.{ts,tsx}"
---

# React & TypeScript Guidelines

- Use React function components and hooks only.
- Prefer `const Component = () => {}` with explicit props typing.
- Avoid `any`; use strict typing and interfaces defined in `src/types/`.
- Use path aliases from `tsconfig.json` such as `@components`, `@data`, `@hooks`, and `@services`.
- Keep presentational and data logic separated.
- Prefer Tailwind CSS utility classes instead of inline styles.
- Place reusable logic in hooks or `src/utils.ts`.
- Keep JSX accessible: use semantic elements, proper labels, and ARIA attributes.
