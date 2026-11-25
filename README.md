# Secure Web Portal

**Author:** Darshita Vaghela

## Project Overview

Secure Web Portal is a backend application built with Node.js, Express.js, and MongoDB. It provides user authentication, GitHub OAuth login, JWT-based authorization, and protected bookmark management.

Users can register with an email and password or authenticate using their GitHub account. Authenticated users can create, view, update, and delete their own bookmarks.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- JSON Web Token (JWT)
- Passport.js
- GitHub OAuth 2.0
- dotenv
- Postman

## Features

### User Authentication
- User registration with name, email, and password
- Password hashing using bcrypt
- User login with password verification
- JWT token generation
- Protected routes using authentication middleware

### GitHub OAuth
- Login using a GitHub account
- Passport.js integration
- JWT generation after successful GitHub authentication

### Bookmark Management
- Create bookmarks
- View all personal bookmarks
- View a single bookmark
- Update bookmarks
- Delete bookmarks
- Restrict access to bookmarks owned by the authenticated user

## Project Structure

```text
secure-web-portal/
├── config/
│   ├── db.js
│   └── passport.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Bookmark.js
├── routes/
│   ├── userRoutes.js
│   └── bookmarkRoutes.js
├── utils/
│   └── auth.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate into the project

```bash
cd secure-web-portal
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/users/auth/github/callback
```

Never commit your actual `.env` file or expose your credentials.

### 5. Start the server

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

## API Endpoints

### User Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Log in a user |
| GET | `/api/users/auth/github` | Start GitHub OAuth |
| GET | `/api/users/auth/github/callback` | Handle GitHub OAuth callback |

### Bookmark Management

All bookmark endpoints require a valid JWT Bearer token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookmarks` | Create a bookmark |
| GET | `/api/bookmarks` | Get all personal bookmarks |
| GET | `/api/bookmarks/:id` | Get one bookmark |
| PUT | `/api/bookmarks/:id` | Update a bookmark |
| DELETE | `/api/bookmarks/:id` | Delete a bookmark |

## Authentication

After successful registration or login, the API returns a JWT token.

For protected routes, include the token in the request:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware verifies the token and identifies the logged-in user.

## Testing

The API can be tested using Postman.

1. Register a user.
2. Log in and obtain a JWT token.
3. Use the token to access bookmark endpoints.
4. Test creating, reading, updating, and deleting bookmarks.
5. Test requests without a token and with an invalid token.
6. Verify that users cannot access another user's bookmarks.
7. Test GitHub OAuth login.

## Security

- Passwords are hashed using bcrypt.
- JWT tokens are used to protect private routes.
- Environment variables store sensitive credentials.
- Bookmark operations are restricted to the authenticated user's own records.
- Unauthorized requests are rejected.

## Author

**Darshita Vaghela**

GitHub: https://github.com/darshita2711