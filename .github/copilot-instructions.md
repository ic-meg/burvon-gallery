# Copilot Instructions for Burvon Jewelry Gallery

## Project Overview
- **Type:** Interactive 3D jewelry e-commerce site
- **Frontend:** React + Vite, Tailwind CSS, Three.js, MediaPipe
- **Backend:** Node/NestJS (API), Laravel (legacy, not active), PostgreSQL (Supabase)

## Architecture & Data Flow
- **Frontend** (`src/`):
  - `components/`: Reusable UI elements
  - `pages/`: Route-level views (e.g., product, user, admin)
  - `assets/`: Centralized exports for images/icons (`assets/index.js`)
  - `App.jsx`/`main.jsx`: App entry points
  - **3D/Virtual Try-On:** Three.js and MediaPipe used for product display and try-on features
- **Backend** (`backend/`):
  - Laravel folder present but not active; ignore unless reactivated
  - API integration is via Node/NestJS (not included in this repo)

## Developer Workflows
- **Install dependencies:** `npm install`
- **Start dev server:** `npm run dev` (Vite, runs at http://localhost:5173)
- **Build for production:** `npm run build`
- **No test scripts or test folders currently present**
- **Font and color usage:**
  - Fonts: Use class names `avant` (Avant Garde), `bebas` (Bebas Neue)
  - Colors: `cream-bg`, `cream-text`, `metallic-bg`, `metallic-text`
- **Asset imports:**
  - Import images/icons from `assets/index.js` (e.g., `import { LogoImage } from '../assets';`)
  - Add new assets by exporting them in `assets/index.js`

## Conventions & Patterns
- **Centralized asset management:** All images/icons exported from `assets/index.js`
- **Tailwind CSS:** Used for all styling; global styles in `index.css`
- **Component structure:**
  - UI components in `components/`
  - Route/page components in `pages/`
- **Admin features:** Located in `src/admin/` and `src/pages/admin/`
- **No custom test, lint, or CI/CD scripts defined in this repo**

## Integration Points
- **3D/Virtual Try-On:** Three.js and MediaPipe (see relevant components/pages)
- **Backend API:** Node/NestJS (not present here); Laravel folder is legacy
- **Database:** PostgreSQL via Supabase (API calls handled in frontend)

## Examples
- Importing assets:
  ```js
  import { LogoImage } from '../assets';
  ```
- Using fonts/colors:
  ```jsx
  <h2 className="avant metallic-text">Elegant Jewelry</h2>
  ```

## Key Files & Directories
- `src/assets/index.js`: Asset exports
- `src/components/`: UI components
- `src/pages/`: Route-level views
- `src/App.jsx`, `src/main.jsx`: App entry
- `src/index.css`: Tailwind/global styles

## Collaboration
- Pull before push to avoid conflicts
- Ask lead before changing structure/config
- Use VS Code and GitHub Desktop for workflow

---
For questions or unclear patterns, ask for clarification or review with the lead developer.