# 📡 **API Endpoints**

## Base URL

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

Success Response (200):

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

## Blog API Endpoints

### 1. List All Posts

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

### 2. View Single Post

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

### 3. Create New Post

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

### 4. Update Post (Author Only)

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

### 5. Delete Post (Author Only)

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
