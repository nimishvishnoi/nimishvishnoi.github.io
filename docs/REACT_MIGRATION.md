# Nimish Vishnoi's Portfolio - React 19 Migration

A modern, full-featured portfolio website built with React 19, TypeScript, Tailwind CSS, and Vite. Deployed on GitHub Pages.

## Tech Stack

- **Framework**: React 19 with TypeScript (strict mode)
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6 with custom theme
- **Animations**: Framer Motion 10.16.16
- **Forms**: React Hook Form + Zod validation
- **Database**: Firebase Real-Time Database (for contact form messages)
- **Icons**: react-icons 4.12.0
- **Package Manager**: Yarn
- **Deployment**: GitHub Pages (automatic via GitHub Actions)

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Header, Navigation, MobileNav, etc.)
│   ├── sections/        # Page sections (About, Skills, Resume, Projects, Contact)
│   └── ui/              # Reusable UI components (Card, Badge, Button, etc.)
├── hooks/               # Custom React hooks (useScrollSpy, useMobileNav, etc.)
├── services/            # Firebase integration and utilities
├── data/                # Content data (skills, experience, projects, etc.)
├── types/               # TypeScript type definitions
├── styles/              # Global CSS and Tailwind configuration
├── App.tsx              # Main app component
├── main.tsx             # React entry point
└── utils.ts             # Utility functions

public/
├── index.html           # HTML entry point
└── favicon.svg          # Site favicon

.github/
├── workflows/
│   └── deploy.yml       # GitHub Actions deployment pipeline
├── copilot-instructions.md   # AI guidelines
├── instructions/
│   └── javascript.instructions.md
└── prompts/
    └── update-experience.prompt.md
```

## Quick Start

### Prerequisites
- Node.js 20+ (recommended)
- Yarn 4.0+
- Firebase account (for contact form)

### Installation

1. **Clone and navigate to project**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up Firebase**
   - Copy `.env.example` to `.env.local`
   - Add your Firebase credentials from [Firebase Console](https://console.firebase.google.com)
   - Create a "Message" node in Firebase Real-Time Database with appropriate security rules

4. **Start development server**
   ```bash
   yarn dev
   ```
   - Open http://localhost:5173 in your browser
   - HMR (Hot Module Replacement) enabled for instant updates

5. **Build for production**
   ```bash
   yarn build
   ```
   - Output goes to `dist/` directory
   - Minified and optimized for deployment

## Available Commands

```bash
yarn dev          # Start development server with HMR
yarn build        # Build production bundle to dist/
yarn preview      # Preview production build locally
yarn lint         # Run ESLint to check code quality
yarn format       # Format code with Prettier
yarn format:check # Check if code needs formatting
```

## Features

### ✨ Core Features
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1024px
- **Dark Mode**: Toggle between light and dark themes (persisted in localStorage)
- **Smooth Animations**: Framer Motion animations on scroll and interactions
- **Contact Form**: React Hook Form with Zod validation, Firebase submission
- **Mobile Navigation**: Animated drawer menu for mobile devices
- **Scroll Spy**: Active section highlighting in navigation
- **Resume PDF Download**: Download your resume directly from portfolio
- **Social Links**: Connected to GitHub, LinkedIn, Facebook, Twitter, Instagram

### 🎨 Design System
- **Colors**: Primary #25ad7b (teal), Secondary #2eafec (blue)
- **Fonts**: Open Sans (body), Raleway (headings), Poppins (accents)
- **Animations**: Custom Tailwind animations (fadeIn, fadeInUp, slideIn)
- **Components**: Semantic HTML with accessibility (ARIA roles, alt text)

### 🔐 Security
- Firebase API keys in `.env.local` (never committed)
- Client-side form validation with Zod schema
- Firebase security rules for database access control
- No sensitive data in frontend code

### 📱 Responsive Breakpoints
- Mobile: 0px (default)
- Tablet: 768px (`md:`)
- Desktop: 1024px (`lg:`)

## Content Management

### Updating Portfolio Content

All content is stored in `src/data/` as TypeScript modules:

- **About**: `src/data/about.ts` - Professional summary and description
- **Skills**: `src/data/skills.ts` - Categorized skills with proficiency levels
- **Experience**: `src/data/experience.ts` - Work history (auto-calculates years/months)
- **Education**: `src/data/education.ts` - Academic background
- **Projects**: `src/data/projects.ts` - Portfolio projects with links
- **Contact**: `src/data/contact.ts` - Contact info and social links

### Updating Experience Years

Experience is calculated automatically from start dates. To keep it current:

1. Edit `src/data/experience.ts` with your latest work history
2. Or use the prompt at `.github/prompts/update-experience.prompt.md` to have Copilot help

## Deployment

### Automatic Deployment (GitHub Pages)
- Push to `main` branch → GitHub Actions builds React app → Deploys to GitHub Pages
- Workflow: `.github/workflows/deploy.yml`
- Base URL: `https://yourusername.github.io/`

### Manual Deployment
```bash
yarn build        # Generate dist/ directory
git add dist
git commit -m "Deploy production build"
git push origin main
```

## Firebase Setup

### Real-Time Database Rules
```json
{
  "rules": {
    "Message": {
      "$date": {
        "$messageId": {
          ".write": "true",
          ".read": "auth != null"
        }
      }
    }
  }
}
```

### Contact Form Flow
1. User fills form with validation
2. Client-side Zod validation
3. Firebase server-side validation
4. Message stored at `/Message/{MMDDYYYY}/{uniqueId}`
5. Success/error message displayed
6. Form reset on success

## Code Quality

### TypeScript
- Strict mode enabled (`strict: true`)
- No `any` types allowed
- Path aliases: `@components`, `@hooks`, `@data`, `@types`, `@services`, `@styles`

### ESLint & Prettier
```bash
yarn lint              # Check code quality
yarn lint --fix        # Auto-fix ESLint issues
yarn format            # Format with Prettier
```

### Best Practices
- React 19 patterns (hooks, composition)
- Custom hooks for reusable logic
- Semantic HTML and ARIA attributes
- Mobile-first CSS with Tailwind utilities
- Component composition over props drilling
- Error boundaries and validation

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

## Performance Optimizations

- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Unused code removed in production
- **Image Optimization**: Lazy loading, responsive images
- **CSS**: Tailwind purges unused styles
- **Caching**: GitHub Pages caches static assets
- **Compression**: Gzip compression on deploy

## Troubleshooting

### Port Already in Use
```bash
yarn dev --port 3000
```

### Build Fails
```bash
rm -rf node_modules dist
yarn install
yarn build
```

### Firebase Connection Issues
- Verify `.env.local` has correct Firebase credentials
- Check Firebase project is active
- Review Firebase security rules (allow writes from web)

### GitHub Pages Not Updating
- Verify workflow completed successfully
- Check repository settings: Pages → Source set to "GitHub Actions"
- Clear browser cache or use incognito window

## Contributing

To maintain code quality:
1. Follow TypeScript strict mode
2. Run `yarn lint --fix` before committing
3. Test on both desktop and mobile
4. Update documentation for new features

## License

© 2024 Nimish Vishnoi. All rights reserved.

## Contact

- Email: nimish.vishnoi@rocketmail.com
- Phone: +91 829-971-8692
- Location: Noida, UP, India
- GitHub: [github.com/nimishvishnoi](https://github.com/nimishvishnoi)
- LinkedIn: [linkedin.com/in/nimish-vishnoi](https://linkedin.com/in/nimish-vishnoi)

---

Built with ❤️ using React 19 & TypeScript
