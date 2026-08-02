# Sketchly 🎨

**Sketchly** is a real-time collaborative whiteboard web application where multiple authenticated users can draw, sketch, and collaborate together — live, in the same board, from anywhere.

Build as a full-stack, production-style monorepo using Next.js, Express, Socket.IO, PostgreSQL(Neon), and Redis — designed to demonstrate real-time system architecture.

---

## ✨ Features

- **Authentication** — Sign up, log in, log out (Better Auth)
- **Dashboard** — Create, rename, delete, and search boards; recent boards view
- **HTML5 Canvas Whiteboard** — Pen, Eraser, Rectangle, Circle, Line, Arrow, Text, Select tools with adjustable color and brush size
- **Solo & Collaborative Modes** — Draw solo with auto-save, or click "Collaborate" to generate a share link and go live with others
- **Real-Time Sync** — Drawings, cursor positions, and presence sync instantly across all connected users via Socket.IO
- **Live Cursors & Presence** — See who's online and where their cursor is, with join/leave toast notifications
- **Chat** — In-board real-time chat with message bubbles
- **File Support** — import PDFs onto the board (via Cloudinary)
- **Export** — Export the board as PNG or PDF (processed via background jobs)
- **Version History** — Automatic snapshots with the ability to restore a previous board state
- **Undo / Redo** — Local editing history per session
- **Invite Flow** — Share a link; new users are guided through signup/login and dropped directly into the shared board (not the dashboard)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Shadcn UI, Tailwind CSS, HTML5 Canvas API |
| State Management | Zustand |
| Forms & Validation | React Hook Form, Zod |
| Backend | Node.js, Express.js, Socket.IO |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Authentication | Better Auth |
| File Storage | Cloudinary |
| Caching / Pub-Sub | Redis (Upstash) |
| Background Jobs | BullMQ |
| Monorepo Tooling | Turborepo, pnpm workspaces |
| Deployment | Railway |

---

## 🏗️ Architecture Overview


- **REST API** handles stateless operations: auth, board CRUD, file uploads, export requests, history.
- **WebSocket layer** handles real-time, high-frequency events: drawing sync, cursor movement, presence, chat.
- **Redis** powers Socket.IO's horizontal scaling (Pub/Sub adapter) and backs the BullMQ job queues.
- **BullMQ workers** run as a separate process, handling image processing, PDF import rasterization, and export rendering asynchronously.
- **Solo mode** draws locally and auto-saves via REST; clicking **Collaborate** upgrades the session to a live WebSocket connection without losing existing work.

---

## 📁 Project Structure

```
sketchly/
├── apps/
│   ├── web/                     # Next.js frontend
│   │   ├── app/                  # Routes: landing, auth, dashboard, board, join
│   │   ├── components/            # Canvas, dashboard, board, presence, ui components
│   │   ├── stores/                 # Zustand stores (canvas, presence)
│   │   ├── hooks/                   # useSocket, useBoard, useAuth, useDebounce
│   │   ├── lib/                      # API helpers, auth client, drawing engine
│   │   └── public/
│   │
│   └── server/                  # Express + Socket.IO backend
│       ├── src/
│       │   ├── modules/            # board, drawing, file, notification, history, ai
│       │   ├── websocket/           # Socket.IO server + real-time event handlers
│       │   ├── jobs/                 # BullMQ queues + workers
│       │   ├── middleware/            # authGuard, errorHandler
│       │   └── config/                 # Redis, Cloudinary, multer clients
│       └── worker.ts             # Standalone entry point for BullMQ workers
│
├── packages/
│   ├── db/                      # Drizzle schema, relations, and DB client
│   ├── auth/                    # Better Auth configuration
│   ├── websocket/                # Shared Socket.IO event constants & types
│   ├── eslint-config/
│   └── typescript-config/
│
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- A [Neon](https://neon.tech) PostgreSQL database
- An [Upstash](https://upstash.com) Redis database
- A [Cloudinary](https://cloudinary.com) account

### 1. Clone and install

```bash
git clone https://github.com/yourusername/sketchly.git
cd sketchly
pnpm install
```

### 2. Set up environment variables

**`apps/server/.env`**
```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000
PORT=3001
REDIS_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**`packages/db/.env`**
```env
DATABASE_URL=
```

**`apps/web/.env`**
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### 3. Push the database schema

```bash
cd packages/db
pnpm drizzle-kit push
```

### 4. Run the app

```bash
cd ../..
pnpm dev
```

This starts both `apps/web` (port 3000) and `apps/server` (port 3001) via Turborepo.

To run the BullMQ worker separately:
```bash
cd apps/server
pnpm worker
```

---

## 📄 License

This project is for educational/portfolio purposes.

---

## 🙋 Author

Built as a full-stack learning project to demonstrate real-time collaborative systems, monorepo architecture, and end-to-end feature ownership from database schema to deployed UI.
