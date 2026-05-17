# Me and You Backend

This backend uses Node.js, Express, EJS, and MongoDB.

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start MongoDB locally or update `MONGO_URI` in `.env`.

## Run

```bash
npm run dev
```

## Seed data

```bash
npm run seed
```

## API

- `GET /api/songs`
- `GET /api/artists`
- `GET /api/albums`

The root page also renders a simple EJS status page.
