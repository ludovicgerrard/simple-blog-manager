# User Management API Testing Guide

This document shows how to test all the user management endpoints that have been implemented.

## Prerequisites

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` (SQLite database is automatically created)
3. Generate APP_KEY: `node ace generate:key` (if not already done)
4. Run migrations: `node ace migration:run`
5. Start the development server: `npm run dev`

**Note:** This project uses SQLite database stored in `tmp/app.sqlite3`. No database server setup is required!

## API Endpoints

### Base URL

```
http://localhost:3333
```

### Health Check

**GET** `/`

```bash
curl -X GET http://localhost:3333/
```

Response:

```json
{
  "message": "User Management API",
  "version": "1.0.0",
  "status": "healthy"
}
```

## Authentication Endpoints

### 1. Register User

**POST** `/api/auth/register`

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Success Response (201):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-02T11:00:00.000Z"
    },
    "token": {
      "type": "Bearer",
      "value": "your-access-token-here"
    }
  }
}
```

Error Response (409 - User exists):

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. Login User

**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Success Response (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-02T11:00:00.000Z"
    },
    "token": {
      "type": "Bearer",
      "value": "your-access-token-here"
    }
  }
}
```

Error Response (401):

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Protected Endpoints (Require Authentication)

For all protected endpoints, include the Authorization header:

```
Authorization: Bearer your-access-token-here
```

### 3. Get User Profile

**GET** `/api/auth/profile`

```bash
curl -X GET http://localhost:3333/api/auth/profile \
  -H "Authorization: Bearer your-access-token-here"
```

Success Response (200):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-02T11:00:00.000Z",
      "updatedAt": "2025-01-02T11:00:00.000Z"
    }
  }
}
```

### 4. Update User Profile

**PUT** `/api/auth/profile`

```bash
curl -X PUT http://localhost:3333/api/auth/profile \
  -H "Authorization: Bearer your-access-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith"
  }'
```

Success Response (200):

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Smith",
      "email": "john@example.com",
      "createdAt": "2025-01-02T11:00:00.000Z",
      "updatedAt": "2025-01-02T11:15:00.000Z"
    }
  }
}
```

### 5. Change Password

**PUT** `/api/auth/password`

```bash
curl -X PUT http://localhost:3333/api/auth/password \
  -H "Authorization: Bearer your-access-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

Success Response (200):

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

Error Response (400 - Wrong current password):

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

### 6. Logout

**POST** `/api/auth/logout`

```bash
curl -X POST http://localhost:3333/api/auth/logout \
  -H "Authorization: Bearer your-access-token-here"
```

Success Response (200):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Validation Rules

### Registration

- `fullName`: Required, 2-100 characters
- `email`: Required, valid email format, normalized
- `password`: Required, 8-128 characters

### Login

- `email`: Required, valid email format
- `password`: Required, minimum 1 character

### Profile Update

- `fullName`: Optional, 2-100 characters when provided

### Password Change

- `currentPassword`: Required
- `newPassword`: Required, 8-128 characters

## Error Responses

### Validation Errors (422)

```json
{
  "errors": [
    {
      "field": "email",
      "rule": "email",
      "message": "The email field must be a valid email"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Testing with Postman

You can import these curl commands into Postman or create a collection with the following structure:

1. **Environment Variables:**
   - `base_url`: `http://localhost:3333`
   - `token`: Set this after login/register

2. **Collection Structure:**
   - Health Check (GET {{base_url}}/)
   - Auth/Register (POST {{base_url}}/api/auth/register)
   - Auth/Login (POST {{base_url}}/api/auth/login)
   - Auth/Profile (GET {{base_url}}/api/auth/profile)
   - Auth/Update Profile (PUT {{base_url}}/api/auth/profile)
   - Auth/Change Password (PUT {{base_url}}/api/auth/password)
   - Auth/Logout (POST {{base_url}}/api/auth/logout)

For protected endpoints, add Authorization header with value: `Bearer {{token}}`
