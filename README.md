# Auth

A clean Node.js authentication example using Express, MongoDB, JWT access tokens, and cookie-based refresh tokens.

---

## 🚀 Overview

This repository demonstrates a complete authentication API flow with OTP-based email verification, including:

- User registration with OTP email verification
- Email verification using one-time passcodes
- Login after email verification
- Short-lived JWT access tokens
- Refresh token handling via `HttpOnly` cookies
- Profile retrieval with token validation
- Session management with logout and logout-all support

---

## 📦 Project Structure

```
src/
  app.js
  server.js
  config/
    config.js
    database.js
  controllers/
    auth.controller.js
  models/
    session.model.js
    user.model.js
  routes/
    auth.routes.js
```

---

## ⚙️ Setup

1. Install project dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Create a `.env` file with these values:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=your_database_name
JWT_SECRET_KEY=your_jwt_secret_key
```

---

## 🔌 Available Routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user and send OTP verification email |
| POST | `/api/auth/verify-email` | Verify email using OTP code |
| POST | `/api/auth/login` | Authenticate a verified user and set a refresh token cookie |
| GET | `/api/auth/get-me` | Return the authenticated user's profile using access token |
| GET | `/api/auth/refresh-token` | Issue a new access token using the refresh token cookie |
| GET | `/api/auth/logout` | Revoke the current session and clear the refresh token cookie |
| GET | `/api/auth/logout-all` | Revoke all active sessions across all devices |

---

## 🧠 How It Works

- `register` creates a new user account and sends an OTP to their email
- `verify-email` validates the OTP code and marks the email as verified
- `login` authenticates verified users and creates a short-lived access token (`15m`) plus a refresh token valid for `7d`
- The refresh token is stored as a secure cookie and hashed in the database
- `get-me` validates the access token from `Authorization: Bearer <token>` header
- `refresh-token` validates the refresh cookie and issues a new access token plus a rotated refresh token
- `logout` revokes the current session
- `logout-all` revokes all active sessions for the user across all devices

---

## 📝 Notes

- Passwords are currently hashed using `crypto.createHash('sha256')`
- For production, replace SHA-256 with `bcrypt` or `argon2`
- Set `secure: true` on cookies when running over HTTPS
- Keep `JWT_SECRET_KEY` private and do not store secrets in source control

---

## 📚 References

- `src/server.js` — application entry point and MongoDB connection
- `src/app.js` — Express middleware and route registration
- `src/controllers/auth.controller.js` — authentication business logic
- `src/routes/auth.routes.js` — API route definitions
- `src/config/config.js` — environment configuration

