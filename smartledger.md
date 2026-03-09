# SmartLedger

A digital credit ledger platform for small shopkeepers to track customer credit, send payment reminders, and maintain transaction history.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Neon-compatible) |
| Auth | JWT (bcryptjs + jsonwebtoken) |
| Messaging | WhatsApp Click-to-Chat, SMS device share |

---

## Project Structure

```
smartledger/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Router & app layout
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/
│   │   ├── db.js              # PostgreSQL pool
│   │   └── init.sql           # Database schema
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, validation, errors
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic
│   ├── tests/                 # Jest tests
│   ├── server.js              # Express entry point
│   └── package.json
│
└── docs/
    └── smartledger.md         # This file
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon)

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/smartledger
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Initialize Database

Run the SQL schema against your PostgreSQL instance:

```bash
psql $DATABASE_URL -f server/config/init.sql
```

### 4. Run the Application

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/profile` | Get current user profile |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/customers` | Add customer |
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/summary` | Get dashboard summary |
| GET | `/api/customers/:id` | Get customer by ID |
| DELETE | `/api/customers/:id` | Delete customer |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/:customer_id` | Get transaction history |

### Reminders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reminders/send` | Send & log reminder |
| GET | `/api/reminders/history` | Get reminder history |

---

## Database Schema

### users

| Column | Type |
|---|---|
| id | SERIAL PK |
| name | VARCHAR(100) |
| email | VARCHAR(150) UNIQUE |
| password_hash | VARCHAR(255) |
| shop_name | VARCHAR(150) |
| created_at | TIMESTAMP |

### customers

| Column | Type |
|---|---|
| id | SERIAL PK |
| user_id | INTEGER FK → users |
| name | VARCHAR(100) |
| phone | VARCHAR(20) |
| balance | NUMERIC(12,2) |
| created_at | TIMESTAMP |

### transactions

| Column | Type |
|---|---|
| id | SERIAL PK |
| customer_id | INTEGER FK → customers |
| amount | NUMERIC(12,2) |
| type | VARCHAR(20) — credit/payment/discount |
| note | TEXT |
| created_at | TIMESTAMP |

### reminder_logs

| Column | Type |
|---|---|
| id | SERIAL PK |
| customer_id | INTEGER FK → customers |
| message | TEXT |
| channel | VARCHAR(20) — whatsapp/sms/manual |
| sent_at | TIMESTAMP |
| status | VARCHAR(20) |

---

## Business Logic

### Balance Calculation

```
balance = total_credit − total_payments − total_discounts
```

- **Credit** → increases balance (customer owes more)
- **Payment** → decreases balance (customer paid)
- **Discount** → decreases balance (shopkeeper forgave)

### Reminder System

Template:

```
Your balance of ₹{amount} is Due.

Please pay at the earliest.

— {shop_name}
```

Channels: WhatsApp (wa.me click-to-chat), SMS (sms: protocol), Manual

---

## Security

- JWT authentication on all protected routes
- Password hashing with bcryptjs (10 salt rounds)
- Input validation via express-validator
- SQL injection prevention via parameterized queries
- Helmet.js for HTTP security headers
- CORS enabled

---

## Testing

```bash
cd server
npm test
```

Tests cover:

- Auth endpoints (register/login validation)
- Customer CRUD operations
- Transaction creation & balance calculations

---

## Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

Use environment variables for all credentials.
