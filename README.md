# InternVerify (PBL Project)

InternVerify is a full-stack internship and certificate verification platform with role-based workflows for **students**, **colleges**, and **companies**.

## Project Structure

```text
intership tracker/
  client/   # React + Vite frontend
  server/   # Node.js + Express + MongoDB backend API
  mobile/   # Expo mobile app (optional)
```

## Features

- User authentication (JWT)
- Role-based access: student, college, company
- Certificate submission with file upload
- Multi-step approval workflow:
  - Student submits
  - College approves/rejects
  - Company approves/rejects
- QR-based verification flow
- Offer management (send / accept / reject)
- Notification system

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- Mobile: Expo + EAS (Android build)
- Deployment: Render (web service + static site)

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)

## Local Setup

### 1. Clone

```bash
git clone https://github.com/SATHISH07002/pbl-project.git
cd pbl-project
```

### 2. Backend Setup (`server`)

```bash
cd server
npm install
```

Create `server/.env` (you can copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/internverify
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm start
```

Backend URL: `http://localhost:5000`

### 3. Frontend Setup (`client`)

Open a new terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## Seed Demo Users (Optional)

From `server` directory:

```bash
node scripts/seed.js
```

Default demo users created by seed:

- `student@demo.com` / `password123`
- `college@demo.com` / `password123`
- `company@demo.com` / `password123`

## API Modules

- `/api/auth` - register, login, profile, user lists
- `/api/internships` - certificate submission, approvals, verification
- `/api/offers` - company offers and student responses
- `/api/notifications` - user notifications and read status

Health check:

- `GET /` -> API status JSON

## Deployment

Deployment files included:

- `render.yaml`
- `DEPLOYMENT.md`

Use `DEPLOYMENT.md` for full Render + MongoDB Atlas + EAS steps.

## Mobile (Expo) - Optional

If using the `mobile/` app:

```bash
cd mobile
npm install
npx expo start
```

For APK build:

```bash
npx eas build -p android --profile apk
```

## Notes

- Uploaded files are served from `server/uploads`.
- CORS is controlled by `FRONTEND_URL` in backend env.
- Keep `.env` files private.
