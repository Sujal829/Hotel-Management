# Hotel Order Management (MERN)

## Local dev

### Prereqs
- Node.js 18+
- MongoDB running locally

### Setup

```bash
cd digital-diner

# backend env
cp backend/.env.example backend/.env

# frontend env
cp frontend/.env.example frontend/.env

# install
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Seed demo data (tables include Table 5)

```bash
cd digital-diner/backend
node seed.js
```

### Run (backend + frontend)

```bash
cd digital-diner
npm run dev
```

Vite may choose a different port if `5173` is busy. The backend dev CORS allows `localhost:anyPort`.

## OTP (dev)
- OTP is mocked and printed in the backend console.
- Default dev OTP is `0000` (configurable via `DEV_OTP`).

