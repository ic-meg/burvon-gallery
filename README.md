# Burvon Jewelry Gallery

**An Interactive 3D Virtual Jewelry Shopping Website with Try-On Features.**

Burvon Jewelry Gallery is an e-commerce platform that allows users to browse jewelry collections, view 3D product models, and experience virtual try-on functionality. The system also includes an admin panel for managing products, users, collections, customer inquiries, and website content.

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Three.js (3D Product Display)
- MediaPipe (Virtual Try-On)

### Backend
- Node.js + NestJS

### Database
- PostgreSQL (Supabase Cloud Database)

---

## Getting Started

### 1. Clone the Repository

#### Option A — GitHub Desktop
1. Open GitHub Desktop.
2. Go to `File > Clone Repository`.
3. Select `burvon-gallery`.
4. Choose a destination folder.
5. Open the project in VS Code.

#### Option B — Git CLI

```bash
git clone https://github.com/your-username/burvon-gallery.git
cd burvon-gallery

```

### 2. Install Dependencies
```bash
npm install
```


### 3. Environment Variables Configuration 
This project uses environment variables for API keys, database connections, and external services.
Actual credentials are not included for security reasons.

#### Frontend  (.env.example) 
Create a .env file and copy the following:

##### PAYMENT (PayMongo - Sandbox)
VITE_PAYMONGO_PUBLIC_KEY=your_paymongo_public_key
VITE_PAYMONGO_SECRET_KEY=your_paymongo_secret_key

##### BACKEND API ENDPOINTS (LOCAL)
- VITE_PRODUCT_API=http://localhost:3000/product/
- VITE_CATEGORY_API=http://localhost:3000/category/
- VITE_CATEGORIES_API=http://localhost:3000/category
- VITE_ORDER_API=http://localhost:3000/order
- VITE_USER_API=http://localhost:3000/user
- VITE_CART_API=http://localhost:3000/cart
- VITE_WISHLIST_API=http://localhost:3000/wishlist
- VITE_COLLECTION_API=http://localhost:3000/collection
- VITE_CONTENT_API=http://localhost:3000/content
- VITE_REPORTS_API=http://localhost:3000/reports
- VITE_TRIPO_API=http://localhost:3000/tripo

#### Backend  (.env.example) 
Create a .env file inside the backend folder and copy:

##### SERVER CONFIG
PORT=3000
- VITE_API_URL=http://localhost:3000

#### PAYMENT (PayMongo)
- VITE_PAYMONGO_PUBLIC_KEY=your_paymongo_public_key
- VITE_PAYMONGO_SECRET_KEY=your_paymongo_secret_key

#### EMAIL SERVICE (Resend)
- RESEND_API_KEY=your_resend_api_key

#### GOOGLE AUTH
- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret

##### DATABASE (Supabase PostgreSQL)
- DATABASE_URL=your_supabase_database_url
- DIRECT_URL=your_supabase_direct_url

##### 3D MODEL API
- TRIPO_API_KEY=your_tripo_api_key

### 4. Running the System

```bash
npm run dev:all 
```

#### Open your browser at: 
http://localhost:5173

### 5. Database Information

The system uses a cloud-hosted PostgreSQL database via Supabase.

No local database installation is required.
Ensure valid Supabase credentials are added to the .env file before running the system.


### 6. Admin Access

- Super Admin can assign access permissions.
- Admin access depends on assigned roles.
```bash
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── assets/        # All icons/images
│   │   │   └── index.js   # Centralized exports
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route-level views
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│
├── backend/
│   └── NestJS API
│
├── .env.example
└── README.md

```

### 7. Collaboration Guideline
- Pull latest changes before pushing.
- Run ``` npm install  ``` after cloning.
- Do not commit  ``` .env ```  files or secret keys.

### 8. Notes for Evaluators
- The live domain may currently be inactive.
- A fully runnable local version is included in the submission.
- Configure ``` .env ``` files before running the system.
