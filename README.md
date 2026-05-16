# Auth

A simple Node.js authentication example that uses JWT access tokens, refresh tokens, and cookie-based refresh handling.

---

## 🚀 Overview

This repository demonstrates an authentication flow for a Node.js API, including:

- User registration
- Access token creation with JWT
- Refresh token storage in an HTTP-only cookie
- Protected user profile retrieval
- Token refresh endpoint

---

## 📁 Core Controller Functions

The main controller file is `src/controllers/auth.controller.js`. It exports three async functions:

### `register(req, res)`
Creates a new user and returns an access token.

- Validates that `username` or `email` are not already registered
- Hashes the password using SHA-256
- Saves the user record
- Returns a short-lived access token (`15m`)
- Sets a refresh token cookie valid for `7d`

**Endpoint example**

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "tester1",
  "email": "tester1@example.com",
  "password": "strongpassword"
}
```

**Success response**

```json
{
  "message": "User registered successfully",
  "user": {
    "username": "tester1",
    "email": "tester1@example.com",
    "token": "<JWT_ACCESS_TOKEN>"
  }
}
```

---

### `getMe(req, res)`
Returns authenticated user information using the access token from the `Authorization` header.

- Reads token from `Authorization: Bearer <token>`
- Verifies the JWT token
- Fetches the user by ID
- Returns username and email

**Endpoint example**

```http
GET /api/auth/me
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Success response**

```json
{
  "message": "User info retrieved successfully",
  "user": {
    "username": "tester1",
    "email": "tester1@example.com"
  }
}
```

---

### `refreshToken(req, res)`
Issues a new access token using the refresh token stored in a secure cookie.

- Reads refresh token from `req.cookies.refreshToken`
- Verifies the refresh token
- Generates a new access token and refresh token
- Sets a new refresh token cookie

**Endpoint example**

```http
GET /api/auth/refresh-token
Cookie: refreshToken=<JWT_REFRESH_TOKEN>
```

**Success response**

```json
{
  "message": "Access token refreshed successfully",
  "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
}
```

---

## 🧭 Project Structure

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
    user.model.js
  routes/
    auth.routes.js
```

---

## 🛠️ Installation

```bash
npm install
npm start
```

---

## 📝 Notes

- Password hashing is currently implemented with `crypto.createHash('sha256')`.
- For production, use a stronger password hashing library such as `bcrypt` or `argon2`.
- Enable `secure: true` for cookies when using HTTPS in production.
- Keep `config.jwtSecretKey` secure and do not commit it to source control.

