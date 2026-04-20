# Project Guidelines

## Code Style
- **HTML**: Semantic sections with IDs for navigation anchors. Use Bootstrap utility classes for layout and responsive design.
- **CSS**: Mobile-first approach with breakpoints at 768px and 1024px. Primary colors: `#25ad7b` (teal), `#2eafec` (blue). Fonts: "Open Sans" (body), "Raleway" (headings), "Poppins" (accents).
- **JavaScript**: jQuery-centric with ES5 syntax, IIFE pattern for encapsulation. Event delegation for dynamic elements. Reference [main.js](assets/js/main.js) for patterns.

## Architecture
Static single-page portfolio website deployed via GitHub Pages. All third-party libraries vendored locally in `assets/nimish/` to avoid CDN dependencies. No backend or build process—pure HTML/CSS/JS.

## Build and Test
No build commands required. Deployment is automatic via GitHub Actions on push to `main` branch (see [.github/workflows/static.yml](.github/workflows/static.yml)).

## Conventions
- **Libraries**: Vendored in `assets/nimish/` (Bootstrap CSS-only, jQuery, AOS, Typed.js, Owl Carousel, VenoBox, Isotope, etc.). Update manually—no npm.
- **Animations**: Use AOS library with data attributes (`data-aos`, `data-aos-delay`). Initialize with `duration: 1000, easing: "ease-in-out-back", once: true`.
- **Icons**: Mix of icofont, boxicons, and Bootstrap icons. Prefer consistent usage within sections.
- **Experience Calculation**: Update hardcoded join date in `experienceCalculator()` function annually (currently Aug 2018).
- **Mobile Navigation**: Toggle `mobile-nav-active` class on `<body>` for menu state.
- **Scroll Behavior**: Smooth scroll with 1500ms delay, scroll spy offset of 200px.

## Potential Pitfalls
- Avoid mixing icon libraries excessively—standardize on one per section.
- Update experience date manually to prevent stale information.
- Ensure accessibility: Add alt text to images, proper ARIA roles for progress bars.
- Test mobile menu toggle on slow connections to avoid flicker.
- Scroll spy offset may need adjustment for different viewport heights.</content>
<parameter name="filePath">d:\Nimish Vishnoi\nimishvishnoi.github.io\.github\copilot-instructions.md