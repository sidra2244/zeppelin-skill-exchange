# 🔄 Local Skill Exchange Board

> **Zeppelin Web Development Fellowship 2026 — Group M2 — Project 1**

A full-stack real-time web application that connects people who want to **teach** and **learn** skills locally. Post what you can offer, find what you need, get automatically matched, and chat instantly — no middlemen, no fees.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🌍 Frontend | [zeppelin-skill-exchange.vercel.app](https://zeppelin-skill-exchange.vercel.app) |
| ⚡ Backend API | [Railway Deployment](https://zeppelin-p1-skill-exchange-production.up.railway.app/) |
| 📁 GitHub Repo | [github.com/MinhasAbdullah/zeppelin-p1-skill-exchange](https://github.com/MinhasAbdullah/zeppelin-p1-skill-exchange) |

---


## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + Tailwind CSS + Vite |
| **Backend** | Django 6 + Django REST Framework |
| **Database** | PostgreSQL (Neon) |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **Real-time Chat** | Django Channels + Redis + WebSockets |
| **Storage** | Cloudinary |
| **Deployment** | Railway (Backend) + Vercel (Frontend) |

---

## 📁 Project Structure

```
zeppelin-p1-skill-exchange/
├── backend/                  # Django + DRF
│   ├── core/                 # Project settings & URLs
│   ├── users/                # Auth, profiles, block/unblock
│   ├── listings/             # Listings CRUD, filters, reports
│   ├── matches/              # Auto-matching logic & endpoints
│   ├── chat/                 # Real-time WebSocket chat
│   ├── requirements.txt
│   └── .env.example
├── frontend/                 # React + Tailwind
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Full page components
│   │   └── services/         # API service (axios)
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL or Neon account
- Cloudinary account
- Redis (for chat in production)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/MinhasAbdullah/zeppelin-p1-skill-exchange.git
cd zeppelin-p1-skill-exchange/backend

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash
# source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy env file and fill in your values
cp .env.example .env

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `backend/.env`:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True

DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=your-neon-host
DB_PORT=5432

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | Register new user | ❌ |
| POST | `/api/auth/login/` | Login with email + password | ❌ |
| GET | `/api/auth/me/` | Get my profile | ✅ |
| GET | `/api/auth/my-listings/` | Get my listings | ✅ |
| POST | `/api/auth/change-password/` | Change password | ✅ |
| POST | `/api/auth/block/` | Block a user | ✅ |
| DELETE | `/api/auth/unblock/{id}/` | Unblock a user | ✅ |
| GET | `/api/auth/blocked/` | Get blocked users list | ✅ |

### Listings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/listings/` | Browse all listings | ❌ |
| POST | `/api/listings/` | Create listing | ✅ |
| GET | `/api/listings/{id}/` | Get single listing | ❌ |
| PUT | `/api/listings/{id}/` | Edit listing | ✅ (owner) |
| DELETE | `/api/listings/{id}/` | Delete listing | ✅ (owner) |
| POST | `/api/listings/{id}/report/` | Report listing | ✅ |

### Filters & Search
```
GET /api/listings/?search=python
GET /api/listings/?category=technology
GET /api/listings/?city=islamabad
GET /api/listings/?type=offer
GET /api/listings/?category=music&city=lahore&type=offer
```

### Matches
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/matches/` | Get my matches | ✅ |
| GET | `/api/matches/{id}/` | Get match detail | ✅ |

### Category Options
```
technology · language · music · cooking · sports · art · academic · other
```

---

## 💬 Real-time Chat

Chat is powered by **Django Channels + Redis + WebSockets**.

- Each match gets its own chat room using the match ID
- Messages are delivered instantly via WebSocket connection
- No email or phone numbers shared between users

---

## 🛡️ Moderation

- **Report a listing** — listing auto-hides after 3 reports
- **Block a user** — their listings and matches disappear immediately
- **Unblock** — their content becomes visible again

---

## 🌿 Git Workflow

```
main          ← production only
  └── dev     ← integration & testing
        ├── feature/backend-abdullah
        ├── feature/hassan
        ├── feature/sidra
        ├── feature/akash
        └── feature/wajihulqammar
```

---

## 👥 Team — Group M2

| # | Name | Role | Branch |
|---|------|------|--------|
| 1 | **Abdullah Minhas** | Team Lead + Backend Developer | `feature/backend-abdullah` |
| 2 | **Hassan Adil** | Frontend — Matches, Chat, Profile, API Integration | `feature/hassan-adil` |
| 3 | **Sidra** | Frontend — Landing, About, Browse, Auth Pages | `feature/sidra` |
| 4 | **Akash** | Frontend — Create Listing | `feature/akash` |
| 5 | **Wajih ul Qammar** | Real-time Chat + Deployment | `feature/wajihulqammar` |

---

## 📜 License

Built as part of the **Teerop Web Development Fellowship 2026**.

---

<p align="center">
  Built with ❤️ by Group M2 — Zeppelin Web Development Fellowship 2026
</p>
