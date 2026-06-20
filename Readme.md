# 💬 Bazm - Real-Time Room-Based Chat App

Bazm is a sleek, premium, real-time chat application built with a modern tech stack. It features a custom event-driven WebSocket protocol, allowing users to create private rooms, share access codes, and communicate instantly without requiring user accounts or persistent databases.

## ✨ Features

- **Real-Time Communication** — Lightning-fast messaging powered by raw WebSockets.
- **Room-Based Architecture** — Users are isolated into private rooms using a robust Node.js `Map` and `Set` state management system.
- **Zero Friction** — No sign-ups or logins required. Enter a name, create a code, and start chatting.
- **Premium UI/UX**
  - Glassmorphism and translucent UI elements.
  - Dynamic, auto-generated avatars and colors based on user names.
  - Auto-scrolling to the latest messages.
  - Formatted timestamps and real-time live indicators.
- **Memory Safe** — Built-in "Janitor" logic on the backend to automatically gracefully disconnect users and destroy empty rooms, preventing memory leaks.
- **Strictly Typed** — End-to-end TypeScript ensuring the frontend and backend speak the exact same protocol.

## 🛠️ Tech Stack

### Frontend

| Layer     | Technology          |
| --------- | ------------------- |
| Framework | React 19 (via Vite) |
| Styling   | Tailwind CSS        |
| Language  | TypeScript          |
| Hosting   | Vercel              |

### Backend

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Runtime    | Node.js                                    |
| Framework  | Express.js (HTTP wrapper for port sharing) |
| WebSockets | `ws` package                               |
| Language   | TypeScript (`tsx` for execution)           |
| Hosting    | Render                                     |

## 🏗️ Architecture & Protocol

This application does not rely on third-party libraries like Socket.io. Instead, it utilizes a custom-built JSON envelope protocol. Every message sent between the client and server adheres to a strict TypeScript Discriminated Union.

**Client → Server Intents**

- `create` — Generates a new 6-character room code.
- `join` — Validates and adds a user's socket to an existing room's `Set`.
- `chat` — Broadcasts a message to all sockets in a specific room.
- `leave` — Gracefully removes a user from a room and alerts others.

**Server → Client Responses**

- `room_created` — Returns the generated room ID.
- `system` — Broadcasts server-level events (e.g., "Alice joined the chat").
- `chat` — Delivers the message with an injected server-side timestamp.
- `error` — Handles invalid room codes or bad requests.

## 🚀 Local Development Setup

To run this project locally, you will need two terminal windows — one for the backend and one for the frontend.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Backend Setup

Clone the repo.

```bash
git clone https://github.com/shadan1212/bazm.git
```

Navigate to the backend directory, install dependencies, and start the WebSocket server.

```bash
cd chat-backend
npm install
npm run dev
```

The server will start running on `ws://localhost:8080`.

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite development server.

```bash
cd chat-frontend
npm install
npm run dev
```

The React app will usually start on `http://localhost:5173`.

## 🌍 Deployment

The Frontend is deployed on Vercel & the backend is deployed on Render.
