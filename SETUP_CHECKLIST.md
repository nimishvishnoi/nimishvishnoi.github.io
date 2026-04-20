# React Migration - Setup & Post-Implementation Checklist

## Phase 1: Local Setup & Testing

### ✅ Installation
- [ ] Run `yarn install` to install all dependencies
- [ ] Verify no errors during installation
- [ ] Check `node_modules/` directory created

### ✅ Environment Configuration
- [ ] Create `.env.local` file (copy from `.env.example`)
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Create new Firebase project (if not exists)
- [ ] Copy Web app credentials to `.env.local`
- [ ] Verify `.env.local` is in `.gitignore` (never commit!)

### ✅ Firebase Real-Time Database Setup
- [ ] Enable Real-Time Database in Firebase Console
- [ ] Create "Message" node at root level
- [ ] Set security rules (see REACT_MIGRATION.md)
- [ ] Test database connectivity

### ✅ Development Server
- [ ] Run `yarn dev` in terminal
- [ ] Browser opens to http://localhost:5173
- [ ] All sections load without errors
- [ ] Navigation works on desktop and mobile
- [ ] Dark mode toggle works

### ✅ Component Testing
- [ ] **About Section**: Text displays, styling looks good
- [ ] **Skills Section**: Skills display with proficiency levels
- [ ] **Resume Section**: Experience timeline appears, education shows correctly
- [ ] **Projects Section**: Project cards display with links working
- [ ] **Contact Section**: Form appears, validation triggers on empty fields
- [ ] **Contact Form - Firebase**:
  - Fill form with valid data
  - Click "Send Message"
  - Check Firebase Console → Real-Time Database for stored message
  - Verify success message displays
  - Form resets after submission
  - Try with invalid email → error appears

### ✅ Responsive Design
- [ ] **Desktop (1024px+)**: 
  - Left sidebar visible
  - Navigation at top works
  - Layout uses full width
- [ ] **Tablet (768-1023px)**:
  - Mobile header appears
  - Menu button works
  - Sections properly padded
- [ ] **Mobile (<768px)**:
  - Mobile drawer opens/closes smoothly
  - Touch targets adequate (44px+)
  - Forms stack vertically
  - Images responsive

### ✅ Dark Mode
- [ ] Toggle dark mode button
- [ ] Verify colors change appropriately
- [ ] Close browser, reopen → dark mode persists
- [ ] Check all text readable in both modes

### ✅ Animations & Performance
- [ ] Scroll down → sections fade in smoothly
- [ ] Mobile menu animates open/close
- [ ] Buttons have hover effects
- [ ] Scroll to top button appears/disappears
- [ ] Check DevTools Performance → smooth 60fps

### ✅ Forms & Validation
- [ ] **Name field**: Try empty, then < 4 chars → error shows
- [ ] **Email field**: Try invalid email → error shows
- [ ] **Phone field**: Optional - leave blank, try invalid
- [ ] **Subject field**: Try empty, then < 8 chars → error shows
- [ ] **Message field**: Try empty → error shows
- [ ] **Submit**: Only enables when form valid

---

## Phase 2: Production Build

### ✅ Build Process
- [ ] Run `yarn build` in terminal
- [ ] No errors in build output
- [ ] Check `dist/` directory created with contents
- [ ] Verify `dist/index.html` exists
- [ ] Check bundle size is reasonable (< 500KB gzipped)

### ✅ Preview Build Locally
- [ ] Run `yarn preview` (shows production build)
- [ ] Open http://localhost:5173
- [ ] Test all functionality same as dev
- [ ] Verify styling correct
- [ ] Test Firebase form submission works

### ✅ Code Quality
- [ ] Run `yarn lint` → no errors
- [ ] Run `yarn format:check` → all formatted
- [ ] Fix any issues: `yarn lint --fix && yarn format`
- [ ] Review `dist/` bundle for tree-shaking

---

## Phase 3: GitHub Repository & Deployment

### ✅ Git Configuration
- [ ] `.gitignore` includes: `.env.local`, `node_modules/`, `dist/`, `.DS_Store`
- [ ] Verify `.env.example` is committed (but NOT `.env.local`)
- [ ] Run `git status` → no sensitive files shown

### ✅ GitHub Push
- [ ] Commit all changes: `git add . && git commit -m "Migrate to React 19"`
- [ ] Push to main: `git push origin main`
- [ ] Verify all files pushed (check GitHub web interface)

### ✅ GitHub Pages Configuration
- [ ] Go to repo Settings → Pages
- [ ] Source: Select "GitHub Actions"
- [ ] Verify custom domain if applicable
- [ ] Wait for deployment (watch Actions tab)

### ✅ GitHub Actions Workflow
- [ ] Go to repo → Actions tab
- [ ] Verify "Deploy React App" workflow runs
- [ ] Check for any errors in workflow logs
- [ ] Workflow should:
  - ✓ Install dependencies with Yarn
  - ✓ Run `yarn build`
  - ✓ Upload `dist/` artifact
  - ✓ Deploy to GitHub Pages
- [ ] Deployment should complete in 2-3 minutes

### ✅ Live Site Testing
- [ ] Visit https://yourusername.github.io/
- [ ] All sections load correctly
- [ ] Navigation works on mobile and desktop
- [ ] Dark mode toggle works
- [ ] Contact form submits to Firebase
- [ ] Images load properly
- [ ] No console errors (F12 → Console tab)

### ✅ SEO & Meta Tags
- [ ] Check page title correct
- [ ] Meta description visible in browser tab
- [ ] Open Graph tags proper (test with LinkedIn share preview)
- [ ] Favicon displays in browser tab

---

## Phase 4: Content & Customization

### ✅ Update Content
- [ ] Review `src/data/about.ts` → update if needed
- [ ] Update `src/data/experience.ts` if job details changed
- [ ] Verify `src/data/education.ts` matches current info
- [ ] Check `src/data/projects.ts` → all 8 projects listed
- [ ] Verify `src/data/contact.ts` → correct contact info

### ✅ Resume PDF
- [ ] Ensure resume PDF in `public/resume.pdf`
- [ ] Verify download link works
- [ ] Test on mobile and desktop

### ✅ Profile Image
- [ ] Add profile image to `public/profile.jpg`
- [ ] Image should be 400x400px (or responsive)
- [ ] Verify displays in desktop header

### ✅ Social Links
- [ ] Verify all social links correct in `src/data/contact.ts`
- [ ] Test each link (GitHub, LinkedIn, etc.)
- [ ] Icons display properly

### ✅ Custom Styling
- [ ] Review color scheme (primary: #25ad7b, secondary: #2eafec)
- [ ] Adjust `tailwind.config.ts` if preferred colors differ
- [ ] Update fonts if needed (currently Open Sans, Raleway, Poppins)
- [ ] Rebuild: `yarn build` and test changes

---

## Phase 5: Final QA & Launch

### ✅ Cross-Browser Testing
- [ ] Chrome/Edge: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Mobile Chrome: Touch interactions work
- [ ] Mobile Safari: Touch interactions work

### ✅ Accessibility
- [ ] Tab through site → all interactive elements reachable
- [ ] Screen reader test (try NVDA or built-in tools)
- [ ] Color contrast adequate (WCAG AA minimum)
- [ ] Images have alt text (check img tags)
- [ ] Form labels associated with inputs

### ✅ Performance
- [ ] Lighthouse score target: 90+
  - Navigate to production site
  - Run Lighthouse (DevTools → Lighthouse tab)
  - Check scores: Performance, Accessibility, Best Practices, SEO
- [ ] Load time < 3 seconds
- [ ] No JavaScript errors in console
- [ ] Firebase messages load quickly

### ✅ Mobile Experience
- [ ] Viewport width < 768px: Everything responsive
- [ ] Touch targets ≥ 44px
- [ ] No horizontal scrolling
- [ ] Form inputs properly sized for mobile keyboard
- [ ] Navigation drawer smooth animation

### ✅ Firebase Security
- [ ] Test database rules:
  - Anonymous write should work
  - Anonymous read should fail
  - Verify messages stored correctly
- [ ] No API key exposed in frontend code
- [ ] Check network tab → Firebase calls proper

### ✅ Documentation
- [ ] README.md updated with React stack info
- [ ] REACT_MIGRATION.md complete and accurate
- [ ] .env.example has all required variables
- [ ] Comments in complex code sections

---

## Phase 6: Maintenance & Updates

### 📋 Regular Tasks
- [ ] **Monthly**: Check for dependency updates: `yarn upgrade-interactive`
- [ ] **Quarterly**: Update to latest React 19.x version
- [ ] **When content changes**: Edit `src/data/` files and `git push`
- [ ] **When contact received**: Check Firebase Messages node

### 📋 Monitoring
- [ ] Set up GitHub notifications for issues/PRs
- [ ] Monitor Firebase usage (free tier = 100 connections)
- [ ] Check GitHub Pages deployment status periodically
- [ ] Verify analytics/tracking if implemented

### 📋 Backup Strategy
- [ ] Clone repo to external drive
- [ ] Export Firebase data regularly (Firebase Console → Export)
- [ ] Keep `.env.local` backup securely (not in Git)

---

## Common Issues & Solutions

### Issue: Build Fails
**Solution:**
```bash
rm -rf node_modules dist
yarn install
yarn build
```

### Issue: Firebase Form Not Submitting
**Solution:**
- Check `.env.local` has correct credentials
- Verify Firebase Real-Time Database enabled
- Check browser console for errors (F12)
- Test Firebase connection manually

### Issue: GitHub Pages Shows Old Version
**Solution:**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check GitHub Actions workflow succeeded
- Wait 5-10 minutes for CDN cache to refresh

### Issue: Mobile Menu Not Working
**Solution:**
- Verify `useMobileNav` hook imported in App.tsx
- Check mobile header renders on small screens
- Test in DevTools mobile view
- Clear browser cache

### Issue: Dark Mode Not Persisting
**Solution:**
- Check localStorage enabled in browser
- Verify `darkMode` state updates in App.tsx
- Check `dark` class applies to `html` element
- Test in incognito/private mode

---

## Success Criteria ✨

Your migration is complete when:

✅ All sections display correctly  
✅ Contact form submits to Firebase  
✅ Dark mode works and persists  
✅ Mobile responsive on all devices  
✅ GitHub Pages deployment automatic  
✅ No console errors  
✅ Lighthouse score 90+  
✅ All social links working  
✅ Resume PDF downloads  
✅ Site loads < 3 seconds  

---

## Post-Launch Notes

**Document any custom changes here:**
- [ ] Customization 1: _______________
- [ ] Customization 2: _______________
- [ ] Customization 3: _______________

**Important dates:**
- Migration started: _______________
- Migration completed: _______________
- First production deployment: _______________
- Last content update: _______________

---

## Support & Resources

- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Vite Docs**: https://vitejs.dev/
- **Firebase Docs**: https://firebase.google.com/docs
- **GitHub Pages**: https://pages.github.com/

---

**You've successfully migrated your portfolio to React 19! 🚀**
