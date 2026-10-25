# ⚡ IssueFlow — Modern Developer Issue & Task Tracker

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, full-stack developer sprint & issue management system inspired by GitHub Issues and Linear. Built with **React** (Vite), **Node.js / Express**, and clean RESTful architecture.

---

## 🚀 Overview

**IssueFlow** is designed for modern engineering teams to create, prioritize, track, and resolve software tickets. It provides real-time state synchronization, granular filtering by priority and status, and fallback offline resilience.

### ✨ Key Features
- **Interactive Issue Lifecycle**: Move tickets seamlessly between `To Do` ➔ `In Progress` ➔ `Resolved` with instant optimistic UI updates.
- **Priority & Label Filtering**: Filter by urgency (`High`, `Medium`, `Low`) or search by text and tags (`#security`, `#react`, `#java`).
- **RESTful API Backend**: Express.js server providing structured CRUD operations and JSON validation.
- **Graceful Fallback**: Automatically falls back to offline in-memory state if the backend is temporarily disconnected.
- **Modern Dark UI**: Engineered with GitHub-inspired dark aesthetics for low eye fatigue.

---

## 🛠️ Architecture

```
dev-issue-tracker/
├── client/                 # React 19 + Vite Frontend
│   ├── src/
│   │   ├── App.jsx         # Issue board, metrics, modal & state
│   │   ├── index.css       # Clean dark-mode stylesheet
│   │   └── main.jsx        # Entrypoint
│   └── package.json
├── server/                 # Node.js + Express Backend
│   ├── src/
│   │   └── index.js        # REST endpoints & issue data store
│   └── package.json
├── .gitignore              # Ignores build artifacts & node_modules
├── package.json            # Monorepo root scripts
└── README.md
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & uptime statistics |
| `GET` | `/api/stats` | Aggregated issue counts & completion rates |
| `GET` | `/api/issues` | Fetch all issues (supports `?status=`, `?priority=`, `?search=`) |
| `POST` | `/api/issues` | Create a new issue ticket |
| `PATCH`| `/api/issues/:id` | Update issue status or priority |
| `DELETE`| `/api/issues/:id` | Remove an issue |

---

## ⚡ Quickstart

### Prerequisites
- Node.js (v20 or higher)
- npm

### 1. Start the Express Backend API
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Start the React Frontend
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🗺️ Project Roadmap
- [x] Full-Stack CRUD Issue Management (React + Node.js)
- [ ] Connect Java Spring Boot microservice for heavy analytics processing
- [ ] WebSocket live multiplayer sync
- [ ] PostgreSQL / Prisma persistence layer

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
