# InternVerify - Deployment Guide

Deploy backend and frontend on Render. Build APK for Android using EAS Build.

## Prerequisites

- GitHub repo
- MongoDB Atlas cluster
- Render account
- Expo account (for APK build)

---

## 1. MongoDB Atlas

1. Create cluster at mongodb.com/atlas
2. Database Access -> Add user (username + password)
3. Network Access -> Add IP `0.0.0.0/0` (or your Render IPs)
4. Copy connection string, e.g.:
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/internverify?retryWrites=true&w=majority
   ```

---

## 2. Backend (Render)

1. Go to render.com -> New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Environment Variables:
   | Key | Value |
   |-----|-------|
   | `PORT` | (Render sets this) |
   | `MONGO_URI` | `mongodb+srv://...` |
   | `JWT_SECRET` | Strong random string |
   | `FRONTEND_URL` | `https://your-app.onrender.com` |

5. Deploy. Note the backend URL (e.g. `https://internverify-api.onrender.com`).

---

## 3. Frontend (Render - Static Site)

1. Go to render.com -> New Static Site
2. Import GitHub repo
3. Settings:
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Environment Variables:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-api.onrender.com/api` |

5. Deploy.

---

## 4. Post-Deploy

1. Update `FRONTEND_URL` in Render to your Render static site URL
2. Redeploy backend if needed
3. Run seed on production (optional):

   ```bash
   MONGO_URI="your-atlas-uri" node server/scripts/seed.js
   ```

---

## Mobile APK (EAS Build)

1. Update mobile API URL in `mobile/app.json`:
   - `extra.apiUrl` = `https://your-api.onrender.com/api`
2. Login to Expo:
   ```bash
   cd mobile
   npx expo login
   ```
3. Build APK:
   ```bash
   npx eas build -p android --profile apk
   ```
4. Download the APK from the build page and install on your phone.

---

## CORS

Backend CORS is configured to allow `FRONTEND_URL`. Ensure both URLs match.

---

## Verification URL

QR codes use `FRONTEND_URL` + `/verify/:certificateId`. Example:
`https://internverify.onrender.com/verify/abc-123-uuid`
