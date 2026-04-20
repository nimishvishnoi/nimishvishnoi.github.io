# React Portfolio - Quick Reference Guide

## 🚀 Essential Commands

```bash
# Development
yarn dev                 # Start dev server (http://localhost:5173)
yarn build              # Build production bundle to dist/
yarn preview            # Preview production build
yarn lint               # Check code quality with ESLint
yarn lint --fix         # Auto-fix ESLint issues
yarn format             # Format code with Prettier
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Desktop sidebar with profile
│   │   ├── Navigation.tsx           # Desktop top navigation
│   │   ├── MobileHeader.tsx         # Mobile top bar
│   │   ├── MobileNav.tsx            # Mobile drawer menu
│   │   ├── ScrollToTopButton.tsx    # Back-to-top button
│   │   └── index.ts
│   ├── sections/
│   │   ├── AboutSection.tsx         # About me section
│   │   ├── SkillsSection.tsx        # Skills by category
│   │   ├── ResumeSection.tsx        # Experience & education
│   │   ├── ProjectsSection.tsx      # Portfolio projects
│   │   ├── ContactSection.tsx       # Contact form + info
│   │   └── index.ts
│   └── ui/
│       ├── SectionTitle.tsx         # Section header component
│       ├── Card.tsx                 # Reusable card wrapper
│       ├── Badge.tsx                # Skill/tech badges
│       ├── Button.tsx               # Animated button
│       ├── ProgressBar.tsx          # Skill proficiency bars
│       ├── SocialLinks.tsx          # Social media icons
│       └── index.ts
├── hooks/
│   ├── useScrollSpy.ts              # Track active section
│   ├── useScrollToTop.ts            # Show/hide top button
│   ├── useMobileNav.ts              # Mobile menu state
│   └── index.ts
├── services/
│   └── firebase.ts                  # Firebase integration
├── data/
│   ├── about.ts                     # About content
│   ├── skills.ts                    # Skills data
│   ├── experience.ts                # Work experience
│   ├── education.ts                 # Education info
│   ├── projects.ts                  # Portfolio projects
│   └── contact.ts                   # Contact info & social
├── types/
│   └── index.ts                     # TypeScript interfaces
├── styles/
│   └── globals.css                  # Tailwind & globals
├── utils.ts                         # Helper functions
├── App.tsx                          # Main component
└── main.tsx                         # React entry point

public/
├── index.html                       # HTML template
├── favicon.svg                      # Site icon
├── profile.jpg                      # Profile image
└── resume.pdf                       # Resume PDF

.github/
├── workflows/
│   └── deploy.yml                   # GitHub Pages auto-deploy
├── copilot-instructions.md          # AI guidelines
├── instructions/
│   └── javascript.instructions.md
└── prompts/
    └── update-experience.prompt.md
```

## 🎨 Tailwind Classes - Common Patterns

```jsx
// Sections
<section className="py-section px-4 lg:ml-80">
  {/* Content inside .container-custom */}
  <div className="container-custom">
    {/* Sections have left margin on desktop (80) */}
  </div>
</section>

// Cards
<Card>
  {/* Animated hover, shadow, rounded corners */}
</Card>

// Buttons
<Button variant="primary" size="md" icon={<Icon />}>
  Click me
</Button>

// Gradients
<h1 className="gradient-text">Animated Title</h1>

// Dark mode
<div className="bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
  {/* Switches between light/dark automatically */}
</div>

// Animations (Framer Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true, margin: '-100px' }}
>
  {/* Fades in when scrolled to view */}
</motion.div>
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build config, path aliases, GitHub Pages base |
| `tsconfig.json` | TypeScript strict mode, path mapping |
| `tailwind.config.ts` | Custom theme colors, dark mode, animations |
| `postcss.config.js` | Tailwind CSS processing |
| `.eslintrc.cjs` | Code quality rules, no-any enforcement |
| `.prettierrc` | Code formatting standards |
| `package.json` | Dependencies, scripts, project metadata |

## 📝 Editing Content

### Update Skills
Edit `src/data/skills.ts`:
```ts
const skills: Skill[] = [
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    proficiency: 'expert', // expert|advanced|intermediate
  },
  // ...
];
```

### Update Experience
Edit `src/data/experience.ts`:
```ts
const experience: Experience[] = [
  {
    title: 'Senior Engineer',
    company: 'Company Name',
    location: 'City, Country',
    startDate: new Date(2024, 0, 1), // Jan 1, 2024
    endDate: undefined, // undefined = currently working
    description: ['Responsibility 1', 'Responsibility 2'],
    technologies: ['React', 'TypeScript', 'Node.js'],
  },
  // ...
];
```

### Update Projects
Edit `src/data/projects.ts`:
```ts
const projects: Project[] = [
  {
    title: 'Project Name',
    year: 2024,
    description: 'Short description of project',
    technologies: ['React', 'Tailwind'],
    url: 'https://github.com/...',
    category: 'web', // app|web|card
  },
  // ...
];
```

### Add Social Links
Edit `src/data/contact.ts`:
```ts
export const socialLinks: SocialLink[] = [
  {
    platform: 'github',
    url: 'https://github.com/nimishvishnoi',
    icon: 'FaGithub',
  },
  // ...
];
```

## 🔐 Environment Variables

Create `.env.local` (copy from `.env.example`):
```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=project_id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=app_id
```

Access in code: `import.meta.env.VITE_*`

## 🎯 Key Hooks

### useScrollSpy
```ts
const { activeSection } = useScrollSpy(['about', 'skills', 'resume', 'projects', 'contact']);
// Returns current active section ID as user scrolls
```

### useScrollToTop
```ts
const { showButton } = useScrollToTop();
// Shows back-to-top button after scrolling 300px
```

### useMobileNav
```ts
const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useMobileNav();
// Manages mobile menu open/close state
```

## 🎨 Color Scheme

| Name | Light | Dark |
|------|-------|------|
| Primary | #25ad7b | #1da870 |
| Secondary | #2eafec | #1e9ed1 |
| Text | #1a202c | #e2e8f0 |
| BG | #ffffff | #0f1419 |
| Border | #e2e8f0 | #2d3748 |

## ⚡ Performance Tips

```ts
// ✅ DO: Use custom hooks for logic reuse
const { activeSection } = useScrollSpy(['about', 'skills']);

// ❌ DON'T: Pass deeply nested props
// Pass data directly to components

// ✅ DO: Lazy load images
<img loading="lazy" src="..." alt="..." />

// ✅ DO: Use Framer Motion viewport trigger
viewport={{ once: true, margin: '-100px' }}

// ✅ DO: Debounce resize/scroll handlers
export const debounce = (fn, delay) => {...}
```

## 🧪 Testing Commands

```bash
# Type check
yarn tsc --noEmit

# Lint
yarn lint

# Format check
yarn format:check

# Build test
yarn build

# Preview production
yarn preview
```

## 📚 Type Definitions

Check `src/types/index.ts` for:
- `Skill` - Skills with category/proficiency
- `Experience` - Job history with dates
- `Education` - School/university info
- `Project` - Portfolio projects
- `SocialLink` - Social media links
- `ContactInfo` - Email/phone/location
- `ContactFormData` - Form submission data

## 🚨 Common Mistakes to Avoid

| ❌ Wrong | ✅ Right |
|---------|----------|
| `import { useState }` (React 19 auto-import) | Let compiler auto-import |
| Hardcode Firebase keys | Use `.env.local` |
| Use `any` types | Strict TypeScript types |
| Forget `dark:` prefix for dark mode | Always add `dark:` variants |
| Skip `smooth-transition` class | Add for polish |
| Missing accessibility (alt, aria) | Always add accessibility |
| Don't validate forms | Use Zod + React Hook Form |
| Console.logs in production | Use error boundaries |

## 📞 Getting Help

**Type checking issue?**
```bash
yarn tsc --noEmit
```

**Build error?**
```bash
rm -rf dist && yarn build
```

**Firebase not working?**
- Check `.env.local` exists and has correct keys
- Verify Firebase console shows Real-Time Database
- Check browser DevTools Network tab

**Dark mode issue?**
- Ensure `dark` class on `html` element
- Check localStorage for 'darkMode' key
- Verify Tailwind dark mode config

---

**Last Updated**: 2024  
**Version**: React 19 + TypeScript + Vite + Tailwind CSS
