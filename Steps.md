# Authentication API Setup

This project is a simple Node.js authentication API using Express, MongoDB, JWT access tokens, and cookie-based refresh tokens.

## 1. Install dependencies

```bash
npm install express mongoose morgan dotenv jsonwebtoken cookie-parser
npm install --save-dev nodemon
```

## 2. Use ES modules

In `package.json`, make sure the package type is set to `module`:

```json
{
  "type": "module"
}
```

## 3. Configure development script

Use the existing `dev` script to start the server in development mode:

```json
"scripts": {
  "dev": "npx nodemon src/server.js"
}
```

Then run:

```bash
npm run dev
```

## 4. Load environment variables

Install and configure `dotenv` in `src/config/config.js`.

Create a `.env` file with:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=your_database_name
JWT_SECRET_KEY=your_jwt_secret_key
```

## 5. Main app structure

- `src/app.js` configures Express middleware
- `src/server.js` connects to MongoDB and starts the server
- `src/routes/auth.routes.js` exposes the authentication routes
- `src/controllers/auth.controller.js` contains register, login, token refresh, and logout logic
- `src/models/user.model.js` and `src/models/session.model.js` define the MongoDB schemas

## 6. Tokens and storage

Recommended pattern used in this project:

- Keep the short-lived access token in memory on the client
- Store the refresh token in an `HttpOnly` cookie
- Rotate refresh tokens regularly

### Why this pattern?

- Local storage: persists across reloads but is vulnerable to XSS
- Cookies with `HttpOnly`: not accessible from JavaScript and better for refresh tokens
- Memory storage: safest for short-lived access tokens, but lost on refresh

## 7. Current endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user and send OTP verification email |
| POST | `/api/auth/verify-email` | Verify email with OTP code |
| POST | `/api/auth/login` | Login after email verification |
| GET | `/api/auth/get-me` | Get authenticated user profile |
| GET | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/logout` | Logout from current device |
| GET | `/api/auth/logout-all` | Logout from all devices |

## 8. Production notes

- Use a stronger password hashing method like `bcrypt` or `argon2`
- Enable `secure: true` for cookies when using HTTPS
- Keep `JWT_SECRET_KEY` secret and never commit it to source control

