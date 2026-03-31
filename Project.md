# Digital Diner — Project Manifest

This document fully describes the Digital Diner project: architecture, file layout, dependencies, environment, setup, API contract, database schema, seed data, build and run steps, and useful troubleshooting notes. Share this file with another AI/tool and it should be able to reconstruct and run the project.

---

## Summary

Digital Diner is a full‑stack web app:

- Frontend: Vite + React, Tailwind CSS, Redux Toolkit, React Router, Framer Motion, React Three (optional).
- Backend: Express + Node.js, JWT auth, Mongoose (MongoDB) models, REST API.
- DB: MongoDB (primary). SQL equivalents provided for portability.

Primary features:

- OTP-based authentication (dev OTP fallback).
- Profile management (avatar upload, update).
- Orders/curations per user.
- Flow/Visualization pages (React Flow / Three.js placeholders).

---

## High-level file structure

(Important files for reproduction)

- frontend/
  - package.json
  - index.html
  - src/
    - main.jsx
    - index.css
    - App.jsx
    - pages/
      - ProfilePage.jsx
      - Flow.jsx
      - Scene.jsx
    - components/
      - UI/
        - Sidebar.jsx
        - MetricsCard.jsx
    - store/
      - index.js
      - authSlice.js
      - systemSlice.js
- backend/
  - package.json
  - server.js (or app.js)
  - routes/
    - auth.js
    - orders.js
    - profile.js
  - models/
    - User.js
    - Order.js
  - controllers/
  - middleware/
    - authMiddleware.js
  - db/
    - init-mongo.js (seed script)
- project.md (this file)
- README.md
- .env (local config)
- docker-compose.yml (optional)

---

## Required software

- Node.js >= 18 (LTS recommended)
- npm >= 8 or yarn
- MongoDB >= 5.0 (local or cloud Atlas)
- Optional: Docker & docker-compose

---

## Environment variables (sample .env)

Create `.env` in backend and frontend (or central root) with these keys.

```text
// filepath: /home/credentek/Sujal/digital-diner/.env
# Backend
PORT=4000
MONGO_URI=mongodb://localhost:27017/digital_diner
JWT_SECRET=replace_with_secure_secret
DEV_OTP=0000

# Frontend
VITE_API_BASE_URL=http://localhost:4000/api




Install & run (local development)
Backend:

cd backend
npm install
ensure MongoDB is running
node db/init-mongo.js # optional: creates indexes & seeds sample data
npm run dev # or node server.js (your script)
Frontend:

cd frontend
npm install
npm run dev
open http://localhost:5173 (vite default)
Full monorepo quick:

Key npm scripts (examples)
Backend package.json:

"dev" -> nodemon server.js
"start" -> node server.js
"seed" -> node db/init-mongo.js
Frontend package.json:

"dev" -> vite
"build" -> vite build
"preview" -> vite preview
API Contract (REST)
Base: ${VITE_API_BASE_URL} → example: http://localhost:4000/api

Auth:

POST /api/auth/request-otp
body: { name, mobile, email?, role? }
response: { message, tempToken }
POST /api/auth/verify-otp
body: { otp, tempToken }
response: sets cookie jwt; body { user }
POST /api/auth/logout
clears cookie
GET /api/auth/me
header: Authorization: Bearer <token> or cookie jwt
response: { user }
Profile:

GET /api/profile (protected)
returns current user profile
PUT /api/profile/update (protected)
body: { name?, email? }
updates profile
POST /api/profile/upload (protected; multipart/form-data)
form field: avatar (file)
returns updated user (or avatar url)
Orders:

GET /api/orders/user (protected)
returns orders for the authenticated user
POST /api/orders (protected)
body: create order
GET /api/orders/:id (protected/public depending on implementation)
Notes:

Protected routes require valid JWT cookie or Authorization header.
JWT cookie name: jwt.
Models / Schema
Primary collections: users, orders, optional menu/items.

User (MongoDB / Mongoose structure)

_id: ObjectId
name: String — required
mobile: String — unique, required
email: String — optional
role: String enum ['user','admin'] default 'user'
avatarUrl: String — optional (path or full URL)
createdAt / updatedAt: timestamps
Order

_id: ObjectId
userId: ObjectId (ref users)
tableNumber: Number
items: [{ name, qty, price }]
totalAmount: Number
status: String (e.g., 'Pending', 'Completed')
createdAt / updatedAt
MongoDB initialization & seed scripts
Save and run with node backend/db/init-mongo.js.



// filepath: /home/credentek/Sujal/digital-diner/backend/db/init-mongo.js
/**
 * Run: node init-mongo.js
 * Creates database, sample indexes and seeds sample users/orders.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // optional if password used

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_diner';
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true },
  email: String,
  role: { type: String, enum: ['user','admin'], default: 'user' },
  avatarUrl: String,
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tableNumber: Number,
  items: [{ name: String, qty: Number, price: Number }],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGO_URI, connectOptions);
  const User = mongoose.model('User', userSchema);
  const Order = mongoose.model('Order', orderSchema);

  // Create indexes
  await User.init();
  await Order.init();

  console.log('Connected to MongoDB:', MONGO_URI);

  // Clear seed data (caution)
  // await User.deleteMany({});
  // await Order.deleteMany({});

  // Seed a sample user if not exists
  let user = await User.findOne({ mobile: '9999999999' });
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      mobile: '9999999999',
      email: 'demo@example.com',
      role: 'user',
      avatarUrl: '',
    });
    console.log('Created demo user', user._id.toString());
  } else {
    console.log('Demo user already exists');
  }

  // Seed sample orders
  const existingOrders = await Order.find({ userId: user._id }).limit(1);
  if (existingOrders.length === 0) {
    const sampleOrders = [
      {
        userId: user._id,
        tableNumber: 5,
        items: [
          { name: 'Paneer Tikka', qty: 1, price: 250 },
          { name: 'Masala Fries', qty: 2, price: 120 }
        ],
        totalAmount: 490,
        status: 'Completed'
      },
      {
        userId: user._id,
        tableNumber: 2,
        items: [
          { name: 'Mango Lassi', qty: 2, price: 80 }
        ],
        totalAmount: 160,
        status: 'Pending'
      }
    ];
    await Order.create(sampleOrders);
    console.log('Seeded sample orders');
  } else {
    console.log('Orders already exist for demo user');
  }

  await mongoose.disconnect();
  console.log('Disconnected. Seed complete.');
}

seed().catch(err => {
  console.error('Seed error', err);
  process.exit(1);
});


GitHub Copilot

Created a comprehensive project manifest and database initialization scripts. Save the project manifest to the repository root and run the DB script appropriate to your database. The manifest contains full workflow, file layout, env vars, build/run instructions, API contract, and seeding instructions so another tool/AI can reproduce the project.

Install & run (local development)
Backend:

cd backend
npm install
ensure MongoDB is running
node db/init-mongo.js # optional: creates indexes & seeds sample data
npm run dev # or node server.js (your script)
Frontend:

cd frontend
npm install
npm run dev
open http://localhost:5173 (vite default)
Full monorepo quick:

Key npm scripts (examples)
Backend package.json:

"dev" -> nodemon server.js
"start" -> node server.js
"seed" -> node db/init-mongo.js
Frontend package.json:

"dev" -> vite
"build" -> vite build
"preview" -> vite preview
API Contract (REST)
Base: ${VITE_API_BASE_URL} → example: http://localhost:4000/api

Auth:

POST /api/auth/request-otp
body: { name, mobile, email?, role? }
response: { message, tempToken }
POST /api/auth/verify-otp
body: { otp, tempToken }
response: sets cookie jwt; body { user }
POST /api/auth/logout
clears cookie
GET /api/auth/me
header: Authorization: Bearer <token> or cookie jwt
response: { user }
Profile:

GET /api/profile (protected)
returns current user profile
PUT /api/profile/update (protected)
body: { name?, email? }
updates profile
POST /api/profile/upload (protected; multipart/form-data)
form field: avatar (file)
returns updated user (or avatar url)
Orders:

GET /api/orders/user (protected)
returns orders for the authenticated user
POST /api/orders (protected)
body: create order
GET /api/orders/:id (protected/public depending on implementation)
Notes:

Protected routes require valid JWT cookie or Authorization header.
JWT cookie name: jwt.
Models / Schema
Primary collections: users, orders, optional menu/items.

User (MongoDB / Mongoose structure)

_id: ObjectId
name: String — required
mobile: String — unique, required
email: String — optional
role: String enum ['user','admin'] default 'user'
avatarUrl: String — optional (path or full URL)
createdAt / updatedAt: timestamps
Order

_id: ObjectId
userId: ObjectId (ref users)
tableNumber: Number
items: [{ name, qty, price }]
totalAmount: Number
status: String (e.g., 'Pending', 'Completed')
createdAt / updatedAt
MongoDB initialization & seed scripts
Save and run with node backend/db/init-mongo.js.

SQL alternative (Postgres) — create tables & seed
If you prefer Postgres, use this SQL to create equivalent tables.


-- filepath: /home/credentek/Sujal/digital-diner/db/init-postgres.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  table_number INT,
  items JSONB, -- array of objects: [{name, qty, price}]
  total_amount NUMERIC(10,2),
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

-- sample seed
INSERT INTO users (name, mobile, email, role) VALUES ('Demo User', '9999999999', 'demo@example.com', 'user') ON CONFLICT DO NOTHING;

-- get demo user's id and insert sample orders (example uses psql variable)
-- psql -> \gset or do two-step insert using client language

Frontend specifics
Ensure src/index.css contains Tailwind directives:
Tailwind config content paths must include ./index.html and ./src/**/*.{js,jsx,ts,tsx}.
Import src/index.css in src/main.jsx.
Use fallback CSS in src/index.css (plain CSS) to avoid @apply in CSS modules unless wrapped in :global(...).
Troubleshooting checklist (common problems)
Blank screen in browser:

Open DevTools Console for runtime errors.
Ensure src/main.jsx mounts React at div#root.
Ensure index.css is imported and Tailwind didn't fail (watch dev server log).
Tailwind unknown utility / @apply errors:

Remove @apply in CSS modules or wrap with :global(.name) { @apply ... }.
Ensure postcss.config.cjs uses @tailwindcss/postcss adapter package when required.
Auth failures:

Ensure JWT_SECRET is set in .env (or dev fallback in code exists).
Ensure cookie-parser middleware is used in Express: app.use(require('cookie-parser')()).
DB connection errors:

Verify MONGO_URI environment variable.
Run node backend/db/init-mongo.js to create sample data and confirm DB connectivity.
Security notes
Never commit .env with production secrets.
Use strong JWT_SECRET in production.
For file uploads, validate file types, store outside webroot or use a cloud storage service.
Reproducible generation instructions (for AI/tool)
Create repo root.
Add backend/ and frontend/ directories per structure above.
Populate files listed (server, routes, models, React pages).
Install npm packages specified (see package.json examples).
Create .env (sample above).
Start MongoDB and run seed script.
Start backend and frontend dev servers.
Contacts & references
Tailwind docs: https://tailwindcss.com/docs
Vite docs: https://vitejs.dev/
React Three Fiber: https://docs.pmnd.rs/react-three-fiber/getting-started/introduction
React Flow: https://reactflow.dev/
```

Database scripts were included above. If you want I will also add:

- backend/package.json and frontend/package.json templates,
- exact server.js and Mongoose models,
- full CI / Docker Compose files.

Tell me which additional files to output and I will
