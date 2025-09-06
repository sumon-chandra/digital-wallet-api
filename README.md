# 💳 Digital Wallet API

A secure, modular, and role-based **backend API** for a digital wallet system (similar to **bKash** or **Nagad**) built with **Express.js**, **TypeScript**, and **Mongoose**.

Supports **users, agents, and admins**, with wallet management, transactional logic, and role-based access control.

---

## 📌 Project Overview

The **Digital Wallet API** enables users to register, manage wallets, and perform core financial operations like:

- **Users →** Top-up, Withdraw, Send money, View transaction history

- **Agents →** Cash-in, Cash-out, Earn commissions, View commission history

- **Admins →** Manage users & agents, Block/unblock wallets, View all transactions

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

<!-- - ⚙️ **System Management**
  - Admin can configure transaction fees & limits
  - Audit logging (optional) -->

---

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcrypt
- **Deployment**: Vercel / Any Node.js host

---

## 📡 API Endpoints

### User Management

| Method | Endpoint                                | Role  | Description                |
| ------ | --------------------------------------- | ----- | -------------------------- |
| POST   | `/users/register`                       | all   | Create a new User          |
| GET    | `/users`                                | Admin | Get all users              |
| PATCH  | `/users/change-agent-active-status/:id` | Admin | Change agent active status |

### 🔐 Authentication

| Method | Endpoint       | Role | Description           |
| ------ | -------------- | ---- | --------------------- |
| POST   | `/auth/login`  | all  | Login & receive JWT   |
| POST   | `/auth/logout` | all  | Logout and remove JWT |

### 🏦 Wallet Management

| Method | Endpoint                    | Role             | Description                         |
| ------ | --------------------------- | ---------------- | ----------------------------------- |
| GET    | `/wallet`                   | User/Agent/Admin | View own wallet                     |
| POST   | `/wallet/top-up`            | User             | Add money to own wallet             |
| POST   | `/wallet/withdraw`          | User             | Withdraw money from own wallet      |
| POST   | `/wallet/send-money`        | User             | Send money to another user          |
| POST   | `/wallet/cash-in`           | Agent            | Add money to a user’s wallet        |
| POST   | `/wallet/cash-out`          | Agent            | Withdraw money from a user’s wallet |
| PATCH  | `/wallet/change-status/:id` | Admin            | Change wallet status                |
| GET    | `/wallet/commission`        | Agent            | Commission History for Agent        |
| GET    | `/wallet/all-wallets`       | Admin            | Get All Wallets                     |

### 💸 Transactions

| Method | Endpoint        | Role               | Description                                                        |
| ------ | --------------- | ------------------ | ------------------------------------------------------------------ |
| GET    | `/transactions` | Users/Agents/Admin | View own transaction history. Admin will view all the transactions |

---

## 🛡 Security

- 🔒 JWT-based authentication
- 🔒 Passwords hashed with bcrypt
- 🔒 Role-based authorization middleware
- 🔒 MongoDB session rollback for transactional integrity

---

## 💡 Acknowledgements

- Inspired by mobile wallet systems like bKash and Nagad.
- Built with Node.js, Express, MongoDB, and Mongoose.

### 👨‍💻 Author

### Sumon Chandra Shil

💼 Software Service Executive | 💻 MERN Stack & Backend Developer

[🌐 LinkedIn](https://www.linkedin.com/in/sumonchandra/)
| [🐦 Twitter (X)](https://x.com/idev_sumon)
| 📧 idev.sumon@gmail.com

_⚡ Digital Wallet API – Secure, Scalable, and Role-based Wallet Management._
