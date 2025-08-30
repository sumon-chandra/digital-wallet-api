# 💳 Digital Wallet API

A secure, modular, and role-based **backend API** for a digital wallet system (similar to **bKash** or **Nagad**) built with **Express.js**, **TypeScript**, and **Mongoose**.

Supports **users, agents, and admins**, with wallet management, transactional logic, and role-based access control.

---

## 🚀 Features

- 🔐 **Authentication**

  - JWT-based login system
  - Secure password & wallet PIN hashing with bcrypt
  - Role-based authorization (`admin`, `user`, `agent`)

- 🏦 **Wallet Management**

  - Wallet auto-created on registration (initial balance ৳50)
  - Block/unblock wallet (admin only)
  - View wallet balance & transaction history

- 💸 **Transactions**

  - **Users**: Add money, Withdraw, Send money (P2P)
  - **Agents**: Cash-in, Cash-out, Commission history
  - **Admins**: View all transactions, approve/suspend agents
  - Double-entry ledger (debit/credit) for consistency
  - Idempotency keys to prevent duplicate transfers

- ⚙️ **System Management**
  - Admin can configure transaction fees & limits
  - Audit logging (optional)

---

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcrypt
- **Deployment**: Vercel / Any Node.js host
