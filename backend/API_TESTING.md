# User Management & Blog API Testing Guide

This document shows how to test all the user management and blog endpoints that have been implemented.

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

## Blog API Endpoints

### Public Blog Routes (No Authentication)

#### 1. List All Posts

**GET** `/api/blog/posts`

Query Parameters:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)

```bash
curl -X GET "http://localhost:3333/api/blog/posts?page=1&limit=5"
```

Success Response (200):

```json
{
  "success": true,
  "data": {
    "posts": {
      "meta": {
        "total": 10,
        "perPage": 5,
        "currentPage": 1,
        "lastPage": 2
      },
      "data": [
        {
          "id": 1,
          "title": "My First Blog Post",
          "content": "This is the content of my blog post...",
          "authorId": 1,
          "createdAt": "2025-01-02T15:30:00.000Z",
          "updatedAt": "2025-01-02T15:30:00.000Z",
          "author": {
            "id": 1,
            "fullName": "John Doe",
            "email": "john@example.com"
          }
        }
      ]
    }
  }
}
```

#### 2. View Single Post

**GET** `/api/blog/posts/:id`

```bash
curl -X GET http://localhost:3333/api/blog/posts/1
```

Success Response (200):

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "My First Blog Post",
      "content": "This is the content of my blog post...",
      "authorId": 1,
      "createdAt": "2025-01-02T15:30:00.000Z",
      "updatedAt": "2025-01-02T15:30:00.000Z",
      "author": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

Error Response (404):

```json
{
  "success": false,
  "message": "Post not found"
}
```

### Protected Blog Routes (Authentication Required)

#### 3. Create New Post

**POST** `/api/blog/posts`

```bash
curl -X POST http://localhost:3333/api/blog/posts \
  -H "Authorization: Bearer your-access-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Blog Post",
    "content": "This is the content of my new blog post with detailed information."
  }'
```

Success Response (201):

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": 2,
      "title": "My New Blog Post",
      "content": "This is the content of my new blog post with detailed information.",
      "authorId": 1,
      "createdAt": "2025-01-02T16:00:00.000Z",
      "updatedAt": "2025-01-02T16:00:00.000Z",
      "author": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

#### 4. Update Post (Author Only)

**PUT** `/api/blog/posts/:id`

```bash
curl -X PUT http://localhost:3333/api/blog/posts/2 \
  -H "Authorization: Bearer your-access-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Blog Post Title",
    "content": "Updated content for the blog post."
  }'
```

Success Response (200):

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "post": {
      "id": 2,
      "title": "Updated Blog Post Title",
      "content": "Updated content for the blog post.",
      "authorId": 1,
      "createdAt": "2025-01-02T16:00:00.000Z",
      "updatedAt": "2025-01-02T16:15:00.000Z",
      "author": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

Error Response (403 - Not the author):

```json
{
  "success": false,
  "message": "You can only edit your own posts"
}
```

#### 5. Delete Post (Author Only)

**DELETE** `/api/blog/posts/:id`

```bash
curl -X DELETE http://localhost:3333/api/blog/posts/2 \
  -H "Authorization: Bearer your-access-token-here"
```

Success Response (200):

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

Error Response (403 - Not the author):

```json
{
  "success": false,
  "message": "You can only delete your own posts"
}
```

## Blog Validation Rules

### Creating/Updating Posts

- `title`: Required (when creating), 1-255 characters, automatically trimmed
- `content`: Required (when creating), 1-10000 characters, automatically trimmed
- Author is automatically set to the authenticated user
- Both fields are secured against SQL injection through ORM and validation

### Security Features

- **Input Sanitization**: All inputs are trimmed and validated
- **SQL Injection Prevention**: Uses Lucid ORM with parameterized queries
- **Authorization**: Users can only edit/delete their own posts
- **Content Length Limits**: Prevents excessive content submission

## Extended Postman Collection

Add these endpoints to your Postman collection:

**Public Blog Endpoints:**

- List Posts (GET {{base_url}}/api/blog/posts)
- View Post (GET {{base_url}}/api/blog/posts/{{post_id}})

**Protected Blog Endpoints (require Authorization header):**

- Create Post (POST {{base_url}}/api/blog/posts)
- Update Post (PUT {{base_url}}/api/blog/posts/{{post_id}})
- Delete Post (DELETE {{base_url}}/api/blog/posts/{{post_id}})
