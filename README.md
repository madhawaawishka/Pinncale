# 🎮 Pinnacle — Ultimate Online Gaming & Streaming Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-orange.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Pinnacle** is a next-generation online gaming entertainment hub built on the **MERN** stack *(MongoDB, Express.js, React.js, Node.js)*. It delivers a unified, high-performance experience combining a digital game store, live stream broadcasting, creator channels, interactive community forums, competitive leaderboards, and a dedicated admin management portal.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Sample Credentials](#-sample-credentials)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (`server`)](#1-backend-setup-server)
  - [2. Client Portal Setup (`pinnacle`)](#2-client-portal-setup-pinnacle)
  - [3. Admin Portal Setup (`admin`)](#3-admin-portal-setup-admin)
- [Database Seeding](#-database-seeding)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Tech Stack](#-tech-stack)

---

## 🏛 Overview & Architecture

Pinnacle is architected into three coordinated services:

```text
                     ┌─────────────────────────────┐
                     │     MongoDB Atlas (Cloud)    │
                     └──────────────┬──────────────┘
                                    │ (Mongoose ODM)
                                    ▼
                     ┌─────────────────────────────┐
                     │    Express REST API Backend  │
                     │         (Port: 3001)        │
                     └──────┬───────────────┬──────┘
                            │               │
            ┌───────────────┘               └───────────────┐
            ▼                                               ▼
┌─────────────────────────────┐               ┌─────────────────────────────┐
│  Client Frontend (pinnacle) │               │   Admin Dashboard (admin)   │
│         (Port: 3000)        │               │         (Port: 3002)        │
│  - Browse & Buy Games       │               │  - Game & Stream Management │
│  - Watch Live Streams       │               │  - Creator Channel Approvals│
│  - Account & Leveling       │               │  - Financial & Cart Reports │
└─────────────────────────────┘               └─────────────────────────────┘
```

---

## ✨ Key Features

### 🛒 1. Game Store & Catalog
- **Multi-Genre Filter:** Instant category browsing across *Action, Adventure, Racing, Shooter, and Sports*.
- **Live Search:** Dynamic search by game title with animated empty-state feedback.
- **Detailed Game Specs:** Comprehensive system configurations, release dates, publishers, and pricing.
- **Cart & Secure Checkout:** Seamless cart management integrated with **Stripe API** payments and PDF receipt downloads.

### 📺 2. Live Gaming Streams & Channels
- **Live Streaming Feeds:** Interactive video preview on hover with direct channel linkages.
- **Stream Filtering:** Quick-switch by title or popular game categories (*Warzone, Call of Duty, PUBG Mobile, GTA V, etc.*).
- **Creator Channels:** Profile pages, follower/subscriber counting, channel view statistics, and direct subscription handling.

### 🏆 3. Leveling System & Leaderboards
- **Gamified Level Progression:** XP system tracking player activity with automated tier progression (*Rookie $\rightarrow$ Master $\rightarrow$ Legendary*).
- **Top Channels Leaderboard:** Real-time ranking by channel viewership and popularity.

### 💎 4. VIP Premium Membership
- **Tiered Plans:** Exclusive perks and discounted purchases for Standard, Pro, and Elite subscribers.

### 🛡️ 5. Dedicated Admin Portal
- Comprehensive administrative control panels for **Games**, **Streams**, **Channels**, **Users**, **Orders**, **Feedback**, and **FAQ** management.

---

## 📁 Project Structure

```text
Pinnacle/
├── pinnacle/               # Client Frontend Application (Port 3000)
│   ├── src/
│   │   ├── assets/         # High-resolution game & UI assets
│   │   ├── components/     # Reusable UI components (Cards, Header, Footer)
│   │   ├── pages/          # Client routes (Homepage, Gamepage, Streampage, etc.)
│   │   └── index.css       # Tailwind & custom design styles
│   └── package.json
│
├── server/                 # Express Backend API (Port 3001)
│   ├── models/             # Mongoose schemas (Game, Stream, Channel, User, etc.)
│   ├── documents/          # PDF invoice templates
│   ├── seed.js             # Automated database seeding utility
│   ├── index.js            # Main Express server and API routes
│   └── package.json
│
├── admin/                  # Administrative Management Portal (Port 3002)
│   ├── src/
│   │   ├── components/     # Admin modules (GameManagement, StreamManagement, etc.)
│   │   └── pages/          # Admin Dashboard layout
│   └── package.json
│
└── README.md
```

---

## 🔑 Sample Credentials

Use these verified accounts to explore the system:

### 👤 Regular User Account (Client Portal)
- **Email:** `kasun99@gmail.com`
- **Password:** `Kasun123!`
- **Role:** Standard Member (Allows full access to Game Purchasing, Cart, Streaming, Account Profile)

### 👑 Administrator Account (Client Portal)
- **Email:** `admin@pinnacle.com`
- **Password:** `Admin@123`
- **Role:** Administrator (Unlocks the **"All Users"** management tab inside **My Account** on `http://localhost:3000/account`)

### 🛠️ Dedicated Admin Dashboard
- **URL:** `http://localhost:3002`
- **Authentication:** Direct access (starts automatically without login prompts)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.x or newer ([Download Node.js](https://nodejs.org/))
- **npm** v9.x or newer

---

### 1. Backend Setup (`server`)

Open a terminal and start the backend API:

```powershell
cd server
npm install
npm run seed     # (Optional) Populates MongoDB with games, streams, and channels
npm start        # Starts server on http://localhost:3001
```

> **Note:** The server connects to cloud **MongoDB Atlas**. Make sure your internet connection is active.

---

### 2. Client Portal Setup (`pinnacle`)

Open a second terminal to run the client web application:

```powershell
cd pinnacle
npm install
npm start        # Launches client on http://localhost:3000
```

---

### 3. Admin Portal Setup (`admin`)

Open a third terminal to run the dedicated management portal:

```powershell
cd admin
npm install
npm start        # Prompts to run on port 3002 if 3000 is occupied -> press 'y'
```

---

## 🌱 Database Seeding

To quickly populate or restore your database with realistic games, streams, creator channels, and premium plans:

```powershell
cd server
npm run seed
```

This populates:
- **10 Curated Games:** Categorized into Action, Shooter, Racing, Adventure, and Sports with uniform 16:9 covers.
- **3 Creator Channels:** Linked with subscriber counts and custom avatars.
- **6 Live Streams:** Linked directly to channels and matching game types.
- **3 Premium Subscription Plans:** Ready for purchase.
- **Community Tournament Announcements.**

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/:id` | Polymorphic retriever (`/game`, `/stream`, `/cart`, `/premiumplan`) |
| `GET` | `/getGamebyID/:id` | Fetch specific game details |
| `POST` | `/createGame` | Add a new game (Admin) |
| `PUT` | `/updateGame/:id` | Update game specifications & pricing |
| `DELETE`| `/deleteGame/:id` | Delete game from catalog |
| `POST` | `/createStream` | Register new live stream |
| `GET` | `/getChannelByStreamID/:channelid` | Retrieve channel info for stream card |
| `POST` | `/api/login` | User/Admin authentication session |
| `POST` | `/api/signup` | New user account registration |
| `POST` | `/api/payment` | Stripe payment gateway processing |

---

## 💻 Tech Stack

- **Frontend:** React 18, React Router v6, TailwindCSS, Axios, SweetAlert2, SWR
- **Backend:** Node.js, Express.js, Mongoose ODM, Express Session, Bcrypt
- **Database:** MongoDB Atlas Cloud
- **Services:** Stripe Payments, Cloudinary Media, Nodemailer, SendGrid
- **Document Generation:** html-pdf, jsPDF, html2canvas

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
