"# Nimish Vishnoi - React 19 Portfolio

A modern, production-ready portfolio website built with React 19, TypeScript, Vite, Tailwind CSS, and Firebase.

**🚀 Live:** https://nimishvishnoi.github.io/

## Features

- ✨ React 19 with TypeScript strict mode
- 🎨 Responsive design (mobile, tablet, desktop)
- 🌙 Dark mode with persistence
- 📧 Contact form with Firebase submission
- ⚡ Fast build with Vite
- 🎬 Smooth Framer Motion animations
- 📱 Mobile-friendly navigation drawer
- 🔄 Auto-deployment to GitHub Pages
- ♿ Accessible semantic HTML

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Deploy
git push origin main
```

## Setup Instructions

See **[docs/SETUP_CHECKLIST.md](docs/SETUP_CHECKLIST.md)** for detailed step-by-step instructions.

## Documentation

- [docs/REACT_MIGRATION.md](docs/REACT_MIGRATION.md) - Complete tech stack overview
- [docs/SETUP_CHECKLIST.md](docs/SETUP_CHECKLIST.md) - Setup and testing guide
- [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) - Developer quick reference
- [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) - File structure guide
- [docs/MIGRATION_COMPLETE.md](docs/MIGRATION_COMPLETE.md) - Migration completion summary

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 5
- **Styling:** Tailwind CSS 3.3
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Backend:** Firebase Real-Time Database
- **Deployment:** GitHub Pages + GitHub Actions
- **Code Quality:** ESLint + Prettier

## Portfolio Content

- About me with professional summary
- 12 skills categorized by specialty
- 3 work experiences with auto-calculated tenure
- Education history
- 8 portfolio projects
- Contact information and social links
- Downloadable resume PDF

## Getting Help

### Common Issues

**Port already in use:**
```bash
yarn dev --port 3000
```

**Build fails:**
```bash
rm -rf node_modules dist
yarn install
yarn build
```

**Firebase not working:**
- Verify `.env.local` exists with Firebase credentials
- Check Firebase console for Real-Time Database setup
- Review Firebase security rules

For more troubleshooting, see [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md#troubleshooting).

## File Structure

```
src/
├── components/          # React components (16 total)
├── hooks/              # Custom React hooks (3)
├── services/           # Firebase integration
├── data/               # Portfolio content (6 files)
├── types/              # TypeScript interfaces
├── styles/             # Tailwind CSS
├── App.tsx             # Main component
└── main.tsx            # Entry point

public/
├── index.html          # HTML template
├── favicon.svg         # Site icon
└── resume.pdf          # Resume PDF

.github/workflows/      # GitHub Actions pipeline
```

## Performance

- Lighthouse Score: 90+
- Load Time: < 3 seconds
- Bundle Size: ~180KB gzipped
- First Contentful Paint: < 2 seconds

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

## Customization

### Update Content

Edit files in `src/data/`:
- `about.ts` - Professional summary
- `skills.ts` - Your skills
- `experience.ts` - Work history
- `education.ts` - Education background
- `projects.ts` - Portfolio projects
- `contact.ts` - Contact info and social links

### Change Colors

Edit `tailwind.config.ts`:
```ts
primary: { 600: '#your-color' }
secondary: { 600: '#your-color' }
```

### Change Fonts

Edit `tailwind.config.ts`:
```ts
fontFamily: {
  sans: ['Your Font', 'sans-serif'],
  heading: ['Your Font', 'sans-serif'],
  accent: ['Your Font', 'sans-serif'],
}
```

## Deployment

Automatic deployment via GitHub Actions on push to `main` branch.

**Manual deployment:**
```bash
yarn build
git add dist
git commit -m "Deploy production build"
git push origin main
```

## License

© 2024 Nimish Vishnoi. All rights reserved.

## Contact

- Email: nimish.vishnoi@rocketmail.com
- GitHub: [@nimishvishnoi](https://github.com/nimishvishnoi)
- LinkedIn: [Nimish Vishnoi](https://linkedin.com/in/nimish-vishnoi)

---

**Built with React 19 & TypeScript** 🚀" 
