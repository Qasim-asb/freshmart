# FreshMart

FreshMart is a full-stack grocery shopping app built with React, Redux Toolkit
(RTK Query), React Router, Tailwind CSS, Express, and MongoDB.

## Features

* Browse grocery products
* Search products
* Filter products by category
* View product details
* Add and remove favorites
* Add products to cart
* Update cart quantities
* Free delivery calculation
* Checkout form with validation
* Place orders (stock decremented, cart cleared server-side)
* View order confirmation with status timeline
* View previous orders
* Track order status
* Admin dashboard for products and categories
* JWT cookie authentication with protected and admin-only routes
* Responsive design

## Tech Stack

**Client**

* React
* Vite
* React Router
* Redux Toolkit
* RTK Query
* React Redux
* Tailwind CSS
* Lucide React
* Axios (RTK Query base query)

**Server**

* Node.js
* Express
* MongoDB
* Mongoose
* JSON Web Tokens (HTTP-only cookie)
* Cloudinary (product images)
* express-validator

## Getting Started

Clone the project and install dependencies for both the client and server.

### Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/freshmart
JWT_SECRET=replace_me
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=replace_me
CLOUDINARY_API_KEY=replace_me
CLOUDINARY_API_SECRET=replace_me
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run:

```bash
npm run dev
```

### Client

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Run:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Project Structure

```text
freshmart/
├── client/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── pages/
│       └── utils/
└── server/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    └── validators/
```

## API Overview

All routes are prefixed with `/api`. Auth uses an HTTP-only JWT cookie, so the
client sends `withCredentials: true` on every request.

**Auth**

* `POST /auth/register`
* `POST /auth/login`
* `GET  /auth/getCurrentUser`
* `POST /auth/logout`

**Products**

* `GET    /products` (supports `?search=&category=`)
* `GET    /products/:id`
* `POST   /products` (admin, multipart with `image`)
* `PUT    /products/:id` (admin)
* `DELETE /products/:id` (admin)

**Categories**

* `GET  /categories`
* `POST /categories` (admin)

**Cart**

* `GET    /cart`
* `POST   /cart` (`{ productId, quantity }`)
* `PUT    /cart/:productId` (`{ quantity }`, `0` removes)
* `DELETE /cart/:productId`
* `DELETE /cart`

**Favorites**

* `GET    /favorites`
* `POST   /favorites/:productId`
* `DELETE /favorites`

**Orders**

* `POST  /orders` (body: `{ customer }`; server builds the order from the cart)
* `GET   /orders`
* `GET   /orders/:id`
* `GET   /orders/admin` (admin)
* `PATCH /orders/:id/status` (admin)

## Data

FreshMart uses a MongoDB backend as the source of truth. All server state is
managed on the client through RTK Query — there are no Redux slices for cart,
favorites, or orders, and nothing is persisted in LocalStorage.

Order items are stored as snapshots (name, price, unit, image) so order history
stays accurate even if a product changes later.

## Business Rules

* Free delivery on subtotals ≥ $50; otherwise $5
* Order status values: `Confirmed`, `Preparing`, `Out for Delivery`,
  `Delivered`, `Cancelled`

## Notes

* `server/.env` and `client/.env` are gitignored. Use the `.env.example` files
  as templates.
* Product image uploads are handled by Cloudinary. The backend stores
  `{ public_id, url }` on each product.

## License

This project is for learning and development purposes.
