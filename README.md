# Authentication API

Node.js + MongoDB authentication system with signup and login APIs.

## Prerequisites
- Node.js
- MongoDB Atlas account
- npm

## Setup
1. Clone repository
2. Run `npm install`
3. Create `.env` file with:


4. Run `npm start` or `npm run dev` for development

## API Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (Protected)

## Request Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"password123"}'