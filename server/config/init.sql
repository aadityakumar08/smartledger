-- SmartLedger Database Schema
-- Run this file to initialize the database tables

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  shop_name     VARCHAR(150) DEFAULT '',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  phone       VARCHAR(20) NOT NULL,
  balance     NUMERIC(12, 2) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount        NUMERIC(12, 2) NOT NULL,
  type          VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'payment', 'discount')),
  note          TEXT DEFAULT '',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminder_logs (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  message       TEXT NOT NULL,
  channel       VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'manual')),
  sent_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status        VARCHAR(20) DEFAULT 'sent'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_customer_id ON reminder_logs(customer_id);
