# ShopEEZZ — Project Architecture & Documentation

ShopEEZZ is a modern, full-stack e-commerce application designed with a clean separation of concerns using the **Model-View-Controller (MVC)** architectural pattern. It features a responsive React Single Page Application (SPA) on the frontend and a Node.js/Express API backed by MongoDB on the backend.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework & Build Tool**: React 18 (TypeScript) built with Vite (fast Hot Module Replacement).
- **Styling**: TailwindCSS for sleek utility-first responsive styling and layout.
- **Icons**: Lucide React for consistent modern UI icons.
- **Routing**: React Router DOM (v7) managing app-wide client-side routing.
- **Notifications**: React Hot Toast for modern, non-blocking visual feedback.

### Backend (Server)
- **Runtime & Framework**: Node.js with Express.js managing RESTful API routes.
- **Database ORM**: Mongoose connecting to MongoDB.
- **Authentication**: JWT (JSON Web Tokens) for secure, stateless sessions.
- **Security**: bcryptjs for hashing user passwords before database storage.
- **Middleware**: body-parser (request body parsing), CORS (Cross-Origin Resource Sharing), Cookie Parser, and Dotenv for environment configuration.

---

## 📁 Directory & File Structure

Here is a visual representation of the project structure under the restructured layout:

```text
ShopEz-main/
├── client/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── common/         # Logo, Spinners, Skeletons, etc.
│   │   │   ├── layout/         # MainLayout, Navbar, Sidebar
│   │   │   └── products/       # ProductCard, ProductGrid
│   │   ├── context/            # React Global States
│   │   │   ├── AuthContext.tsx # Customer & Admin Auth state
│   │   │   └── CartContext.tsx # Cart management & calculations
│   │   ├── lib/
│   │   │   └── api.ts          # Unified REST API service wrapper
│   │   ├── pages/              # Page view components
│   │   │   ├── admin/          # Admin Dashboard, Products, Orders, Users
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── AdminOrders.tsx
│   │   │   │   ├── AdminProducts.tsx
│   │   │   │   └── AdminUsers.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interface declarations
│   │   ├── App.tsx             # Root Router & Providers Setup
│   │   ├── index.css           # Global CSS and Tailwind Imports
│   │   └── main.tsx            # Entry point rendering the React App
│   ├── index.html              # Frontend DOM template
│   ├── vite.config.ts          # Vite configuration with proxy to server (port 8000)
│   ├── package.json            # Frontend dependencies & scripts
│   └── tsconfig.json           # TypeScript configuration
│
├── server/                     # Node.js + Express Backend Application
│   ├── controllers/            # Controller layer (Business Logic)
│   │   ├── adminController.js   # Dashboard metrics, User & Order logs
│   │   ├── authController.js    # Register, Login, Profile views/updates
│   │   ├── cartController.js    # Cart read, add, update, clear logic
│   │   ├── categoryController.js# Category retrieval & admin CRUD
│   │   ├── orderController.js   # Order creation, User history lookup
│   │   └── productController.js # Product lists, details, and admin CRUD
│   ├── middleware/             # Request Interceptors
│   │   ├── auth.js              # Protect (JWT) & adminOnly access filters
│   │   └── errorHandler.js      # Express global exception handler
│   ├── models/                 # Mongoose Schemas (Data Layer)
│   │   ├── Admin.js             # Landing banners & administrative config
│   │   ├── CartItem.js          # Cart items referencing Product & User
│   │   ├── Category.js          # Categories list schema
│   │   ├── Order.js             # Order receipt metadata & shipping schema
│   │   ├── Product.js           # E-commerce products details & stock levels
│   │   └── User.js              # User details, hashed passwords, roles
│   ├── routes/                 # Express API Endpoint Maps
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── .env                    # Local environment config variables
│   ├── server.js               # App server starter & DB connector (renamed from index.js)
│   ├── package.json            # Backend dependencies & scripts
│   └── seed.js                 # Database seeding script for local/cloud DB
│
├── .gitignore                  # Global Git ignore patterns (node_modules, .env)
└── README.md                   # Basic project introduction
```

---

## 🇮🇳 Indian Localization Features

The application is fully customized for Indian shoppers and store administrators:
1. **Indian Rupee (₹) Currency**: Price indicators throughout the client (Product Cards, Details, Cart, Checkout, Order Receipt, and Admin logs) display prices in Indian Rupees (`₹`).
2. **Indian Shipping Limits**:
   - Free shipping is offered on order values of **₹500** or higher.
   - For orders below ₹500, a flat shipping fee of **₹50** is automatically applied.
3. **Address & Pincode Validations**:
   - Shipping addresses enforce standard 10-digit Indian mobile number formats.
   - Pincodes undergo a strict 6-digit validation check.
4. **Number Formatting**:
   - Revenue figures on the Admin Dashboard are formatted in accordance with the Indian numbering system (e.g. using `en-IN` to group numbers like `₹1,50,000` rather than `₹150,000`).

---

## 🎨 Creative Branding & Premium Design

1. **Integrated Brand Logo (`client/src/components/common/Logo.tsx`)**:
   - Features a custom vector design representing a fast shopping trolley emblem.
   - Styled with a premium emerald green-to-teal gradient background, and highlighted with bright gold-amber accents.
   - Logo typography matches the new identity: `Shop` (black/dark-gray, extra bold) and `EEZZ` (styled in a green-to-amber text gradient).
   - Implemented across the navigation header, footer, login page, and sign-up screens for brand uniformity.

2. **UI Restructuring and Layout Shifts**:
   - **Double-Row Header/Navbar**: Features a dark-emerald top mini-bar providing direct customer support information and local shipping benefits, with a clean bottom bar for brand identity, navigation links, and floating cart controls.
   - **Circular Categories list**: Category navigation on the Homepage has been redesigned from a blocky rectangular grid to a horizontal scrollable strip of circular, border-highlighted badges.
   - **Product Card Redesign**: Cards are framed with a thin gray border that highlights emerald green on hover. Cart submission uses a full-width bottom button instead of a small bottom-right icon, giving the grids a completely different geometric distribution.

---

## ⚙️ Core Application Flows

### 👤 Authentication
- Users register with fullName, email, password, and phone number.
- Passwords are encrypted using `bcryptjs`.
- Successful logins return a signed JWT token, which is stored in the browser's `localStorage` (key: `shopeezz_token`) and attached as a `Bearer` token header in consecutive REST requests.
- Admins possess `role: 'admin'`, granting them access to secure `/admin` layouts on the frontend and REST routes protected by the `adminOnly` middleware on the server.

### 🛒 Cart & Checkout
- Cart items are stored directly in MongoDB, persisting across different devices and logins.
- Placing an order validates that items are in stock, creates an Order record, decrements the product stock levels accordingly, and clears the user's cart in a single transaction-safe manner.
- Standard order placement operates on Cash on Delivery (COD).

### 📊 Admin Panel
- **Dashboard**: Features metrics representing total users, products, orders, and total revenue, along with a list of the 5 most recent orders.
- **Products CRUD**: Allows admins to search, edit, add, or delete products, and toggle product activity statuses.
- **Orders & Users Management**: Allows tracking orders, shifting order states (`pending` ➔ `confirmed` ➔ `packed` ➔ `shipped` ➔ `delivered` ➔ `cancelled`), and reviewing user lists.

---

## 🚀 How to Run the Application

Because client and server are completely decoupled, they are run separately:

### 1. Seeding & Running the Server
Make sure to add your MongoDB connection string in `server/.env`.
```bash
cd server
npm install        # Installs Express, Mongoose, JWT, etc.
npm run seed       # Drops old data and inserts fresh INR products & admin accounts
npm run dev        # Starts backend server on http://localhost:8000 via nodemon
```

### 2. Running the Client
```bash
cd client
npm install        # Installs React, Tailwind, Lucide, React Router, etc.
npm run dev        # Starts Vite dev server on http://localhost:5173
```
*Note: Any request made to `/api` from the frontend is proxied automatically to `http://localhost:8000` to prevent CORS issues.*
