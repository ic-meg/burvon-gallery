# Burvon Jewelry Gallery

**An Interactive 3D Virtual Jewelry Shopping Website with Try-On Features.**  
This platform includes 3D product displays, a virtual try-on feature, wishlist, and e-commerce checkout system.

---

##  Tech Stack

- React + Vite (Frontend)
- Tailwind CSS (Styling)
- Three.js (for 3D display)
- Jeeliz / MediaPipe (for virtual try-on)
- Laravel (Backend API)
- MySQL (Database)

---

##  Getting Started

### 1. Clone the Repository

####  Option A: GitHub Desktop (Recommended for collaborators)
1. Open GitHub Desktop.
2. Go to `File > Clone Repository`.
3. Select `burvon-gallery` from the list (you must be a collaborator).
4. Choose a folder and click **Clone**.
5. Open the project in **VS Code**.

####  Option B: Git CLI
```bash
git clone https://github.com/your-username/burvon-gallery.git
cd burvon-gallery
```

---

### 2. Install Frontend Dependencies (React + Vite)

```bash
npm install
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173)

---

### 3. Install Backend Dependencies (Laravel) (wala pa 'to, wag pansinin)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Laravel backend runs at `http://127.0.0.1:8000`

Make sure `.env` has the correct database credentials.

---


## Project Customization Notes (For Gil & Ley)

**Fonts**
- Font setup is done already.
- Just use the following class names:
  - `avant` – for Avant Garde font
  - `bebas` – for Bebas Neue font

**Custom Colors**
- **Cream:**
  - `cream-bg` – background
  - `cream-text` – text
- **Metallic Black:**
  - `metallic-bg` – background
  - `metallic-text` – text

 **Asset Imports**
- `assets/index.js` is set up for all icons and images.
- To use them in components or pages:
  ```js
  import { LogoImage, WhiteLogo } from '../assets';
  ```
- Just add the image/icon name in the export of `index.js`

**Example Usage**
```jsx
<img src={LogoImage} alt="Burvon Logo" />
<h2 className="avant metallic-text">Elegant Jewelry</h2>
```

---

## 📁 Folder Structure

```
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── assets/         # All icons/images
│   │   │   └── index.js    # Centralized exports
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route-level views
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css       # Tailwind + global styles
│
├── backend/                # Laravel backend
│   ├── app/
│   ├── routes/
│   ├── .env
│   └── ...
└── README.md
```

---

## Collaboration Guidelines

- Use **GitHub Desktop** to pull/push updates
- Open with **VS Code**
- Run `npm install` and `composer install` after cloning
- Pull before you push to avoid merge conflicts
- Ask the lead before changing folder structure or config files

---
