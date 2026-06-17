# ShopEEZZ — E-commerce Application

## 1. Introduction
* **Project Title**: ShopEEZZ — A MERN Stack E-commerce Application
* **Team Members**: This is a solo project.
* **Developer**: [Vishal Gudla] — Full Stack Development (Frontend, Backend, Database Design, Deployment)

---

## 2. Project Overview

### Purpose
ShopEEZZ is a full-stack e-commerce platform designed to provide a seamless online shopping experience tailored for Indian customers. The goal of the project is to build a production-style application that demonstrates a complete shopping flow — from product discovery and cart management to secure checkout and order tracking — alongside a comprehensive admin panel for managing products, orders, and users. The application follows the Model-View-Controller (MVC) architectural pattern to ensure clean separation of concerns, scalability, and maintainability.

### Features
* **Product Catalog**: Browse, search, and filter products by category, with detailed product pages showing descriptions, pricing in ₹, and stock availability.
* **User Authentication & Roles**: Secure registration and login using JWT, with role-based access for regular users and admins.
* **Persistent Cart**: Cart items are stored in MongoDB so they persist across devices and sessions.
* **Indian Localization**: Prices displayed in ₹ with Indian number formatting (`en-IN`), free shipping above ₹500, flat ₹50 fee below that, and validation for 10-digit Indian mobile numbers and 6-digit pincodes.
* **Secure, Transaction-Safe Checkout**: Stock validation, order creation, stock decrement, and cart clearing happen as a single safe operation. Orders use Cash on Delivery (COD).
* **Order Tracking**: Users can view their order history and current status from their profile.
* **Admin Dashboard**: Metrics for total users, products, orders, and revenue, plus the 5 most recent orders, full product CRUD, order status management, and user listing.
* **Custom Branding & Styling**: A custom logo featuring a vector shopping cart set in an emerald-to-teal gradient shield, with the brand name text "ShopEEZZ" rendered in a green-to-amber text gradient. The entire site's primary theme uses a modern, responsive Emerald Green and Mint styling with Amber Gold accents.
* **Redesigned Split-Screen Hero**: A high-impact landing page featuring split layout graphics, Micro-Stats widgets (active buyers, ratings, and top brand counters), and an interactive product preview card.
* **Circular Categories Row**: Displays product categories as horizontal, scrollable circular card badges instead of standard grid blocks.
* **Full-Width Cart CTAs**: Grid cards contain a prominent, full-width "Add to Cart" button at the bottom of the card for visual balance and geometric structure.
* **Dual Promo Banner Grid**: Highlights summer trends and workspaces using two customized promo banners (emerald green and charcoal themes).

---

## 3. Architecture

### Frontend
The frontend is a React 18 (TypeScript) Single Page Application built with Vite for fast development and Hot Module Replacement. Styling is handled with TailwindCSS for a utility-first, responsive design, and Lucide React provides consistent UI icons. Routing is managed using React Router DOM (v7), and React Hot Toast handles non-blocking user notifications.

State management relies on React Context: `AuthContext.tsx` manages customer and admin authentication state, while `CartContext.tsx` manages cart contents and price calculations. All communication with the backend goes through a unified API service wrapper (`lib/api.ts`), and shared TypeScript interfaces are defined in `types/index.ts`. Pages cover the full customer journey (Home, Products, Product Detail, Cart, Checkout, Login, Register, Profile, Orders) as well as the admin section (Dashboard, Products, Orders, Users).

### Backend
The backend is a Node.js application using Express.js to expose a RESTful API, structured according to the MVC pattern:
* **Models**: Mongoose schemas defining the data layer — User, Product, Category, CartItem, Order, and Admin.
* **Controllers**: Business logic for each resource — authController, productController, categoryController, cartController, orderController, and adminController.
* **Routes (View Layer)**: Endpoint definitions mapping HTTP methods to controller functions — authRoutes, productRoutes, categoryRoutes, cartRoutes, orderRoutes, and adminRoutes.
* **Middleware**: `auth.js` provides protect (JWT verification) and `adminOnly` (role-based access) guards; `errorHandler.js` is the global exception handler.

Authentication uses JWT for stateless sessions and `bcryptjs` for password hashing. Additional middleware includes `body-parser` (for JSON and url-encoded payloads), CORS, `cookie-parser`, and `dotenv` for environment configuration. The server runs on `http://localhost:8000`.

### Database
ShopEEZZ uses MongoDB as its database, accessed through Mongoose ODM. The schema is organized around six core collections:

| Collection | Description |
| :--- | :--- |
| **User** | Stores fullName, email (unique), hashed password, phone, and role ('user' or 'admin'). |
| **Product** | Stores product name, description, price (₹), category, stock level, image, and active status. |
| **Category** | Stores the list of product categories used to organize and filter the catalog. |
| **CartItem** | Stores userId, productId, and quantity — representing items in a user's persistent cart. |
| **Order** | Stores userId, ordered items, shipping address, phone, pincode, payment method (COD), shipping fee, total amount, status, and order date. |
| **Admin** | Stores administrative configurations such as landing page banner URLs and homepage parameters. |

Relationships are maintained via references: `CartItem` and `Order` documents reference the `User` who owns them, and `Order` items reference `Product` documents. Placing an order is handled as a transaction-safe sequence — validating stock, creating the order, decrementing product stock, and clearing the cart.

---

## 4. Setup Instructions

### Prerequisites
- **Node.js (v18 or above)** — runtime for both client and server.
- **npm (v8 or above)** — package manager for installing dependencies.
- **MongoDB** — local instance (e.g., via MongoDB Compass) or a cloud instance (MongoDB Atlas).
- **Git** — for cloning the repository.
- **Code Editor** — Visual Studio Code recommended.

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vishhal23/ShopEEZZ.git
   cd ShopEz-main
   ```
2. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```
3. **Configure backend environment variables**: Create a `.env` file inside the `server` folder with the following:
   ```env
   MONGO_URI=mongodb://localhost:27017/shopeezz
   JWT_SECRET=<your-secret-key>
   PORT=8000
   CLIENT_URL=http://localhost:5173
   ```
4. **Seed the database** with sample INR products, admin config banners, and test accounts:
   ```bash
   npm run seed
   ```
5. **Install frontend dependencies**:
   ```bash
   cd ../client
   npm install
   ```
6. **Start the application** (see Section 6 for running both servers).

---

## 5. Folder Structure

### Client (React Frontend)
The client folder contains the Vite + React + TypeScript application:
- `src/components/` — Reusable UI components, split into `common/` (Logo, Spinners, Skeletons), `layout/` (MainLayout, Navbar, Footer), and `products/` (ProductCard, ProductGrid).
- `src/context/` — React Context providers: `AuthContext.tsx` (authentication state) and `CartContext.tsx` (cart management and calculations).
- `src/lib/api.ts` — Unified REST API service wrapper used by all pages to communicate with the backend.
- `src/pages/` — Page-level components: HomePage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, LoginPage, RegisterPage, ProfilePage, OrdersPage, and an `admin/` subfolder containing AdminLayout, AdminDashboard, AdminProducts, AdminOrders, and AdminUsers.
- `src/types/index.ts` — Shared TypeScript interface declarations.
- `src/App.tsx` — Root router and context provider setup.
- `src/main.tsx` — Application entry point.
- `src/index.css` — Global styles and Tailwind imports.
- `vite.config.ts` — Vite configuration, including the proxy of `/api` requests to `http://localhost:8000`.

### Server (Node.js Backend)
The server folder contains the Express + MongoDB backend, organized using the MVC pattern:
- `models/` — Mongoose schemas: `Admin.js`, `CartItem.js`, `Category.js`, `Order.js`, `Product.js`, `User.js`.
- `controllers/` — Business logic: `adminController.js`, `authController.js`, `cartController.js`, `categoryController.js`, `orderController.js`, `productController.js`.
- `routes/` — API endpoint definitions: `adminRoutes.js`, `authRoutes.js`, `cartRoutes.js`, `categoryRoutes.js`, `orderRoutes.js`, `productRoutes.js`.
- `middleware/` — `auth.js` (`protect` & `adminOnly` guards) and `errorHandler.js` (global exception handler).
- `server.js` — Application entry point; starts the server and connects to MongoDB (renamed from `index.js`).
- `seed.js` — Seeds the database with sample INR products and admin accounts.
- `.env` — Local environment configuration (MongoDB URI, JWT secret, port).

---

## 6. Running the Application

The client and server are run independently, in separate terminals.

### Backend
- Navigate to the server directory and start the backend:
  ```bash
  cd server
  npm run dev
  ```
  The backend server starts on `http://localhost:8000` (using nodemon for auto-restart on changes).

### Frontend
- Navigate to the client directory and start the frontend:
  ```bash
  cd client
  npm run dev
  ```
  The frontend dev server starts on `http://localhost:5173`. Any request made to `/api` from the frontend is automatically proxied to `http://localhost:8000`, avoiding CORS issues.

---

## 7. API Documentation

All endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header; admin-only routes additionally require the user's role to be 'admin'.

### Authentication — `/api/auth`
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user (fullName, email, password, phone) | Public |
| **POST** | `/api/auth/login` | Authenticate user and return a JWT | Public |
| **GET** | `/api/auth/profile` | Get the logged-in user's profile | Protected |
| **PUT** | `/api/auth/profile` | Update the logged-in user's profile | Protected |

### Products — `/api/products`
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/products` | Get a list of all products (supports filtering/search) | Public |
| **GET** | `/api/products/:id` | Get details of a single product | Public |
| **POST** | `/api/products` | Add a new product | Admin |
| **PUT** | `/api/products/:id` | Update an existing product | Admin |
| **DELETE** | `/api/products/:id` | Delete a product | Admin |
| **PATCH** | `/api/products/:id/status` | Toggle a product's active status | Admin |

### Categories — `/api/categories`
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/categories` | Get a list of all product categories | Public |
| **POST** | `/api/categories` | Add a new category | Admin |
| **PUT** | `/api/categories/:id` | Update a category | Admin |
| **DELETE** | `/api/categories/:id` | Delete a category | Admin |

### Cart — `/api/cart`
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/cart` | Get the current user's cart items | Protected |
| **POST** | `/api/cart` | Add an item to the cart | Protected |
| **PUT** | `/api/cart/:id` | Update the quantity of a cart item | Protected |
| **DELETE** | `/api/cart/:id` | Remove an item from the cart | Protected |
| **DELETE** | `/api/cart` | Clear the entire cart | Protected |

### Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/orders` | Place a new order (validates stock, decrements stock, clears cart) | Protected |
| **GET** | `/api/orders` | Get the current user's order history | Protected |
| **GET** | `/api/orders/:id` | Get details of a specific order | Protected |

### Admin — `/api/admin`
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/config` | Fetch administrative configurations (landing banners) | Public |
| **GET** | `/api/admin/stats` | Get dashboard metrics (totals for users, products, orders, revenue) | Admin |
| **GET** | `/api/admin/orders` | Get a list of all orders | Admin |
| **PUT** | `/api/admin/orders/:id/status` | Update an order's status | Admin |
| **GET** | `/api/admin/users` | Get a list of all registered users | Admin |

### Example Request & Response
Example: placing an order via `POST /api/orders`

**Request Body**:
```json
{
  "items": [{ "productId": "64f1a2...", "quantity": 2 }],
  "shippingAddress": "123 MG Road, Hyderabad",
  "phone": "9876543211",
  "pincode": "500081",
  "paymentMethod": "COD"
}
```

**Response (201 Created)**:
```json
{
  "orderId": "64f2b3...",
  "status": "pending",
  "totalAmount": 950,
  "shippingFee": 0,
  "message": "Order placed successfully"
}
```

---

## 8. Authentication

ShopEEZZ uses JSON Web Tokens (JWT) for stateless authentication and authorization:
* **Registration**: Users register with fullName, email, password, and phone number. Passwords are hashed using `bcryptjs` before being stored in MongoDB, so plaintext passwords are never persisted.
* **Login**: On successful login, the server signs a JWT (using `JWT_SECRET`) and returns it to the client.
* **Token Storage & Usage**: The frontend stores the JWT in the browser's `localStorage` (key: `shopeezz_token`) and attaches it as a Bearer token (`Authorization: Bearer <token>`) in subsequent API requests.
* **Protected Routes**: The `protect` middleware verifies the JWT on incoming requests and attaches the authenticated user to the request object. Requests without a valid token are rejected with a `401 Unauthorized` response.
* **Role-Based Authorization**: Users have a `role` field ('user' or 'admin'). The `adminOnly` middleware checks this role and restricts access to admin-only routes (product management, order management, user listing, dashboard metrics) to users with `role: 'admin'`. Non-admin users receive a `403 Forbidden` response.
* **Frontend Route Protection**: `AuthContext.tsx` tracks the logged-in user's state across the app, and protected frontend routes (e.g. `/profile`, `/admin/*`) redirect unauthenticated or unauthorized users to the login page.

---

## 9. User Interface

The user interface is built with React and TailwindCSS, providing a clean and responsive shopping experience styled in Emerald Green. Key screens include:
* **Home Page**: Landing page showcasing the new split-screen hero section, circular category lists, promo banners, and new brand logo.
* **Products Page**: Browsable, searchable, and filterable product grid with emerald layouts.
* **Product Detail Page**: Detailed view of a single product with pricing in ₹ and stock status.
* **Cart Page**: View and manage items in the cart, with live total calculations.
* **Checkout Page**: Address entry (with phone/pincode validation), shipping fee calculation, and COD payment selection.
* **Login & Register Pages**: User authentication forms displaying the brand logo at the top center.
* **Profile & Orders Page**: User details and order history with status tracking.
* **Admin Dashboard**: Overview of key metrics — users, products, orders, revenue, and recent activity.
* **Admin Products/Orders/Users Pages**: Management interfaces for CRUD operations and order status updates.

---

## 10. Testing

Testing was carried out primarily through manual and API-level testing:
* **API Testing**: Postman was used to test all backend endpoints — verifying request/response formats, status codes, authentication/authorization enforcement, and error handling for both valid and invalid inputs.
* **Manual UI Testing**: Each page and user flow (registration, login, browsing, cart, checkout, order placement, order tracking, and admin operations) was manually tested across Chrome and Firefox to verify correct behavior and responsiveness.
* **Validation Testing**: Form validations — such as 10-digit mobile numbers, 6-digit pincodes, required fields, and unique email constraints — were tested with both valid and invalid inputs.
* **End-to-End Flow Testing**: The full order lifecycle was tested to confirm that stock validation, order creation, stock decrement, and cart clearing occur correctly as a single safe operation.

---

## 11. Screenshots or Demo
The following pages represent the core screens of the application:
* **Landing Page** — the home page of the application with circular scroll categories.
* **Products Page** — lists all available products in emerald styling.
* **Authentication** — registration and login pages displaying custom vector trolley logo.
* **User Profile** — displays user details and orders history.
* **Cart Page** — where users add and manage products in their cart.
* **Admin Dashboard** — the admin overview page with statistics in ₹.
* **All Orders (Admin)** — where admin can view and manage all orders.
* **All Products (Admin)** — where admin can view all available products.
* **New Product Page (Admin)** — where admin can add new products.

---

## 12. Known Issues
* Currently only Cash on Delivery (COD) is supported; no integration with online payment gateways (e.g. Razorpay, UPI) yet.
* Product image uploads are not yet integrated with a cloud storage service (e.g. Cloudinary, S3); images are referenced by URL or stored locally.
* Order status updates by admins do not yet trigger email or SMS notifications to users.

---

## 13. Future Enhancements
* **Online Payment Integration**: Add support for UPI, cards, and net banking via a gateway such as Razorpay or Stripe.
* **Product Reviews & Ratings**: Allow users to leave reviews and star ratings on products they've purchased.
* **Wishlist**: Let users save products to a wishlist for later purchase.
* **Order Notifications**: Send email/SMS notifications on order placement and status updates.
* **Advanced Admin Analytics**: Add charts/graphs for sales trends, top-selling products, and revenue over time.
* **Image Upload & CDN Integration**: Integrate cloud storage (e.g. Cloudinary) for product image uploads with optimization.
* **Automated Testing**: Add unit and integration tests using Jest, React Testing Library, and Supertest, with CI/CD pipeline integration.
* **Pagination & Infinite Scroll**: Improve performance on the products page for large catalogs.
* **Multi-language Support**: Add support for regional Indian languages alongside English.
