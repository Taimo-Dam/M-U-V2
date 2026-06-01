# 🎵 Me & You — Music Streaming App (V2)

A full-stack music streaming web application built with **React** on the frontend and **Node.js / Express / MongoDB** on the backend. Browse songs, artists, and albums with a modern UI and user authentication.

---

## 📁 Project Structure

```
M-U-V2/
├── backend/       # Express + MongoDB REST API
└── frontend/      # React + Vite SPA
```

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React Router DOM v7](https://reactrouter.com/) | Client-side routing |
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling |
| [Axios](https://axios-http.com/) | HTTP client |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime environment |
| [Express 4](https://expressjs.com/) | Web framework |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM |
| [JSON Web Token](https://jwt.io/) | Authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [CORS](https://github.com/expressjs/cors) | Cross-origin requests |
| [Morgan](https://github.com/expressjs/morgan) | HTTP request logger |

---

## ✨ Features

- 🎵 **Browse Music** — Explore songs, albums, and artists
- 🎤 **Artist Detail Pages** — View an artist's profile and their songs
- 🔐 **Authentication** — Register, login, and logout with JWT-based auth
- 🔑 **Secure Passwords** — Passwords hashed with bcryptjs
- 📱 **Responsive Layout** — Collapsible sidebar, header, and footer
- 🌐 **RESTful API** — Clean API endpoints for all music data

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd M-U-V2
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/meandyou
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=your_super_secret_key
```

#### Seed the Database (optional)

```bash
npm run seed
```

#### Start the Backend

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The backend will be running at `http://localhost:4000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Start the Frontend

```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## 🗺️ Application Routes

### Frontend Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/songs` | All Songs |
| `/albums` | All Albums |
| `/artists` | All Artists |
| `/artist/:name` | Artist Detail |
| `/login` | Login |
| `/register` | Register |

---

## 🔌 API Reference

### Auth Endpoints — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `POST` | `/api/auth/logout` | Logout current user |

#### Register Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

---

### Music Endpoints — `/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/songs` | Get all songs |
| `GET` | `/api/artists` | Get all artists |
| `GET` | `/api/artists/:name` | Get artist by name |
| `GET` | `/api/artists/:name/songs` | Get songs by artist |
| `GET` | `/api/albums` | Get all albums |

---

## 🗄️ Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `username` | String | Required, unique, min 3 chars |
| `email` | String | Required, unique |
| `password` | String | Required, hashed, min 6 chars |
| `timestamps` | Date | Auto-managed by Mongoose |

### Song
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `artist` | String | Required |
| `duration` | String | Required |
| `plays` | Number | Default: 0 |
| `image` | String | Cover image URL |
| `audioUrl` | String | Audio file URL |

### Artist
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `image` | String | Artist photo URL |
| `songs` | Number | Song count, default: 0 |

### Album
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `artist` | String | Required |
| `image` | String | Album cover URL |
| `songs` | Number | Track count, default: 0 |

---

## 🛠️ Available Scripts

### Backend (`/backend`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start with nodemon (hot reload) |
| `start` | `npm start` | Start production server |
| `seed` | `npm run seed` | Seed the database |

### Frontend (`/frontend`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server |
| `build` | `npm run build` | Build for production |
| `preview` | `npm run preview` | Preview production build |
| `lint` | `npm run lint` | Run ESLint |

---

## 📄 License

This project is private and not licensed for public distribution.
