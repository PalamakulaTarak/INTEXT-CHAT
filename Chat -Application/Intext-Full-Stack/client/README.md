# Intext – Full Stack (React + Vite + Express + Socket.io)

A lightweight real‑time chat app with image sharing, password reset via Gmail SMTP, and green/blue branding.

## Tech Stack
- Client: React + Vite, Tailwind CSS v4, Socket.io client
- Server: Node.js, Express, Socket.io, MongoDB (Mongoose)
- Email: Gmail SMTP (app password) with Nodemailer

## Monorepo Structure
```
Intext-Full-Stack/
  client/   # React + Vite front-end
  server/   # Express + Socket.io back-end
```

## Prerequisites
- Node.js 18+
- MongoDB connection string
- Gmail account + app password (for password reset emails)

## 1) Environment Setup
Create environment files from examples and fill values:

- Server
  - Copy `server/.env.example` to `server/.env`
  - Set values: `MONGODB_URI`, `JWT_SECRET`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `MAIL_FROM` (optional), `FRONTEND_URL`, `PORT`

- Client
  - Copy `client/.env.example` to `client/.env`
  - Set `VITE_BACKEND_URL` to your server URL (e.g. `http://localhost:5001` in dev)

## 2) Install Dependencies
From the project root, run:
```powershell
# Server
yarn --cwd server install || npm --prefix server install

# Client
yarn --cwd client install || npm --prefix client install
```

## 3) Run Locally (LAN friendly)
```powershell
# Start server (port 5001 by default)
yarn --cwd server start || npm --prefix server start

# In another terminal: start client (port 5173 strict)
yarn --cwd client dev || npm --prefix client run dev
```
- Ensure `client/.env` VITE_BACKEND_URL points to the server (e.g. `http://localhost:5001` or your LAN IP like `http://192.168.1.10:5001`).

## 4) Useful Scripts
- Server
  - `npm start` – run server
  - `npm run server` – dev with nodemon
- Client
  - `npm run dev` – dev server (host true, strictPort)
  - `npm run build` – production build
  - `npm run preview` – preview built client locally

## 5) Notes
- Auto-scroll is disabled by design; use the “New messages” pill to jump to bottom.
- Images limited to 4MB client-side; server body limit set to 12MB.
- Avoid committing real credentials. `.env` files are ignored; `.env.example` shows required keys.

---

## Troubleshooting
- White screen or API errors: confirm `VITE_BACKEND_URL` and backend `PORT`/CORS.
- Mobile/LAN access: set both URLs to your LAN IP and restart both apps.
- Email not sending: verify Gmail app password, enable “less secure” is NOT needed; use app password only.
