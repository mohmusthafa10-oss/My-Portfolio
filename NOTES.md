# Step 0 Inspection Notes & Baseline Audit

## 1. Repository Inventory
- **Files**:
  - `index.html` (31 KB)
  - `css/styles.css` (33 KB)
  - `css/scroll-motion.css` (767 B)
  - `js/main.js` (19 KB)
  - `js/scroll-motion.js` (5 KB)
  - `LinkedIn_profile.jpeg` (1254x1254 px, 68 KB)
- **Zero package managers / bundlers / npm dependencies**: Pure static HTML/CSS/JS.

## 2. Baseline Browser & Console Audit (Local Python HTTP Server :8000)
- **Console errors / warnings**: Exactly **0 errors, 0 warnings**.
- **Tested viewports**: 320px, 375px, 414px, 768px, 1024px, 1440px, 1920px.
- **Scrollbars / overflow**: `document.documentElement.scrollWidth <= innerWidth` across all tested viewports.

## 3. Discovered Code Issues & Technical Debt
1. **Undefined CSS Variables**:
   - `--font-display` used in multiple headings/labels, but never defined in `:root`.
   - `--accent`, `--accent-blue`, and `--accent-hover` referenced in CSS rules, but never declared.
2. **Animation Leaks & Overrides**:
   - `.hero-chip` keyframe float animation is globally scoped to any `.hero-chip`, causing chips in the "Currently looking for" section to float undesirably.
   - `scroll-motion.js` sets inline `transform` and `opacity` directly onto cards, overriding `.project-card:hover` transforms.
3. **Dead Code**:
   - FAQ accordion CSS (`.faq-*`, `[data-theme="dark"] .faq-trigger:hover`) exists in `styles.css` though FAQ was removed from HTML.
   - Process card CSS (`.process-card`, `.process-step-num`) unused.
   - Unused `offsetTop` scroll loop in `main.js`.
   - Obsolete skill level bar logic (`.skill-level-bar`, `data-level`) in `scroll-motion.js`.
4. **Resilience & Accessibility**:
   - Lacks `<html class="no-js">` progressive enhancement pattern; content hidden by JS-dependent styles could remain invisible if script execution fails.
   - Drawer static counter reads `PROJECT 01 / 02` despite 3 projects.
   - Project drawer backdrop and mobile drawer need proper focus trap and `inert` handling.
   - Missing SVG favicon, missing Open Graph / Twitter metadata, missing `<noscript>` fallback.

## 4. Redesign Architecture Plan
- Clean modular design system tokens in `css/styles.css` (`--ink`, `--paper`, `--surface`, `--line`, `--muted`, `--accent`, `--accent-hover`, typography, motion tokens).
- Single source of truth data file: `js/data.js` for `PROJECTS` and `SKILLS`.
- Centralized motion and accessibility helper: `js/motion.js`.
- Execute redesign section by section with verified git commits after each.


