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

<!-- - ⚙️ **System Management**
  - Admin can configure transaction fees & limits
  - Audit logging (optional) -->

---

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcrypt
- **Deployment**: Vercel

---

## ⚙️ Setup & Environment Instructions
#### 1. Clone the repository
```bash
git clone https://github.com/your-username/digital-wallet-api.git
cd digital-wallet-api
```
#### 2. Install dependencies
```bash
pnpm install
```
#### 3. Create .env file
Inside the root directory, create a ```.env``` file and copy the following variables:
```env
# NODE 
NODE_ENV=development
DB_URL=mongodb+srv://digital-wallet-user:digital-wallet-password@cluster2025.dbuw7xd.mongodb.net/DigitalWalletDB
PORT=5000

# Express
EXPRESS_SESSION=4f12fa6b4ec13c9c41ea81d8c2e5df24fa2630fa4a6d37d3e74f12fa6b4ec13c9c4138e7c1a26499c6b865e23

# MongoDB
MONGODB_URI=mongodb+srv://digital-wallet-user:digital-wallet-password@cluster2025.dbuw7xd.mongodb.net/DigitalWalletDB

# Bcrypt
BCRYPT_SALT_ROUND=10

# JWT
JWT_ACCESS_SECRET=a81f134b37d1ee74f12fa6b4ec13c9c41ea81d8c2e5df24fa2630fa4a6d37db14c6755ec4b938e7c1a26499c6b865e238c6f4c9e1d3198dfb5a8abdf3f57a5de
JWT_ACCESS_EXPIRES=3d

JWT_REFRESH_SECRET=5df24fa2630fa4a6d3e74f12fa6b4ec13c9c4138e7c1a26499c6b865e238c6f4c9d8c2e5df24fa2630fa4a6d37db14c6755ec4b938e7c1a26499c6b865e23g5rw
JWT_REFRESH_EXPIRES=30d
```
#### 4. Run the application
```bash
pnpm run dev
```
The server will run on [http://localhost:5000](http://localhost:5000) (or the port you set in ```.env```).

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

🌐[LinkedIn](https://www.linkedin.com/in/sumonchandra/)
| 🐦[Twitter (X)](https://x.com/idev_sumon)
| 📧idev.sumon@gmail.com

_⚡ Digital Wallet API – Secure, Scalable, and Role-based Wallet Management._
