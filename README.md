# FandomVerse Backend API 🚀

Official backend API for **FandomVerse** social platform (Flutter + Node.js Express).

## 🌐 Live Production API
- **Live Status (Click to test):** [https://fandomverse-backend.vercel.app/api/health](https://fandomverse-backend.vercel.app/api/health)
- **API Base URL for Flutter/App:** `https://fandomverse-backend.vercel.app/api`

---

## 📡 Live Test Links (Open in Browser)
- **Health Check:** [https://fandomverse-backend.vercel.app/api/health](https://fandomverse-backend.vercel.app/api/health)
- **Content Feed:** [https://fandomverse-backend.vercel.app/api/content](https://fandomverse-backend.vercel.app/api/content)
- **Events List:** [https://fandomverse-backend.vercel.app/api/events](https://fandomverse-backend.vercel.app/api/events)
- **Shop Catalog:** [https://fandomverse-backend.vercel.app/api/shop/overview](https://fandomverse-backend.vercel.app/api/shop/overview)

---

## 📡 API Endpoints

### 🔐 Auth & Users
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication (JWT)
- `POST /api/auth/verify-email` - Email code verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Set new password
- `GET  /api/profile/home` - Profile dashboard data
- `GET  /api/profile/me` - Current user details

### 📰 Content & Fandoms
- `GET /api/content` - Content feed (Anime, Gaming, Comics, K-Pop, etc.)
- `GET /api/content/hub` - Fandom hubs list
- `GET /api/content/discover` - Trending & featured articles

### 🔍 Search & Community
- `GET /api/search` - Global full-text search
- `GET /api/posts` - Community posts & discussions
- `GET /api/community/overview` - Community overview

### 🎟️ Events & Tickets
- `GET /api/events` - Upcoming fandom events
- `GET /api/events/nearby` - Location-based nearby events

### 🛍️ Merchandise Shop & AI
- `GET /api/shop/overview` - Store catalog & deals
- `POST /api/ai/chat` - AI Fan Helper assistant

### 🛡️ Admin Portal
- `POST /api/admin/login` - Admin secure access
- `GET  /api/admin/dashboard` - Admin analytics & metrics

---

## 🛠️ Tech Stack
- **Runtime:** Node.js (Express.js)
- **Database:** SQLite (with `sql.js` WebAssembly for serverless compatibility)
- **Deployment:** Vercel Serverless Functions
- **Security:** bcryptjs, JWT authentication, CORS enabled
