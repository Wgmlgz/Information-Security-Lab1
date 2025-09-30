# Information Security Lab 1

This project implements a small, security-hardened REST API

## Stack

- **Runtime**: Node.js, TypeScript
- **Framework**: Express 5
- **DB**: PostgreSQL 16
- **Auth**: JWT, passwords hashed with bcrypt
- **Security**: helmet, CORS, rate limiting, payload validation (Joi), xss-clean

## Endpoints

- `GET /health`: service liveness
- `POST /auth/login` — body: `{ "username", "password" }` -> `{ token }`
- `GET /api/data` — list posts; requires `Authorization: Bearer <token>`
- `POST /api/posts` — create post; body: `{ "title", "body" }`; requires auth

Seed user is created automatically on first run: username `admin`, password `Password123!`.

## Security Measures

- **SQL Injection**: all queries use parameterized statements via `pg` pool.
- **XSS**: API returns JSON, no HTML rendering.
- **Authentication**: JWT on successful login; protected endpoints use middleware to verify token; passwords stored only as bcrypt hashes.
- **Hardening**: `helmet`, `CORS` restrictable via `CORS_ORIGIN`, rate limiter, request size limits.

## CI/CD

GitHub Actions workflow runs on each push/PR:

- Install, lint (`eslint`), build (`tsc`)
- Smoke test server against Postgres service
- `npm audit` (high)
- OWASP Dependency-Check (SCA) and uploads report artifact
