# Finished Goods Inventory Management System

A full-stack inventory management system for grocery/kiryana businesses, built with React and Node.js.

## Tech Stack

### Frontend

* React.js
* Redux Toolkit + RTK Query
* Tailwind CSS
* Lucide React

### Backend

* Node.js + Express.js
* PostgreSQL (Neon)
* Drizzle ORM
* Better Auth
* Socket.IO
* Resend

## Features

* 🔐 Authentication & role-based access
* 📦 Product & inventory management
* 🏷️ Product batches & expiry tracking
* 🛒 Sales & purchases
* 👥 Customers & suppliers
* 💰 Expenses & accounting
* 📊 Dashboard & analytics
* 📝 Audit logs
* 💬 Real-time individual & group chat
* 👁️ Read receipts & unread message indicators

## Backend Structure

```text
project/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── utils/
│   └── server.js
│
└── README.md
```

## Getting Started

### Clone the repository


### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Create `.env`:

```env
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3000
```

### Backend

```bash
cd backend
pnpm install
pnpm dev
```

Create `.env`:

```env
CLIENT_URL=http://localhost:5173
DB_URL=your_neon_database_url

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

RESEND_API_KEY=your_resend_api_key
```

## Development

Run frontend and backend separately:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```

> Make sure your environment variables are configured before running the application.
> ## Role-Based Access Control

| Feature              | Admin | Manager | Cashier |
|----------------------|:-----:|:-------:|:-------:|
| Dashboard            |   ✅   |    ✅    |    ✅    |
| Products & Inventory |   ✅   |    ✅    |    👁️   |
| Purchases            |   ✅   |    ✅    |    ❌    |
| Sales / POS          |   ✅   |    ✅    |    ✅    |
| Customers            |   ✅   |    ✅    |    ✅    |
| Suppliers            |   ✅   |    ✅    |    ❌    |
| Expenses             |   ✅   |    ✅    |    ❌    |
| Accounting           |   ✅   |    ✅    |    ❌    |
| Audit Logs           |   ✅   |    👁️   |    ❌    |
| User Management      |   ✅   |    ❌    |    ❌    |
| Individual Chat      |   ✅   |    ✅    |    ✅    |
| Group Chat           |   ✅   |    ✅    |    ✅    |

-> ✅ Full Access · 👁️ View Only · ❌ No Access

## License

This project is for learning and development purposes.
