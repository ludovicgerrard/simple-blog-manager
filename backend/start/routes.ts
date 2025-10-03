/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const BlogController = () => import('#controllers/blog_controller')

// Health check endpoint
router.get('/', async () => {
  return {
    message: 'User Management & Blog API',
    version: '1.0.0',
    status: 'healthy',
  }
})

// Public auth routes (no authentication required)
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/api/auth')

// Protected auth routes (authentication required)
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/profile', [AuthController, 'profile'])
    router.put('/profile', [AuthController, 'updateProfile'])
    router.put('/password', [AuthController, 'changePassword'])
  })
  .prefix('/api/auth')
  .middleware(middleware.auth())

// Public blog routes (reading posts)
router
  .group(() => {
    router.get('/posts', [BlogController, 'index']) // List all posts
    router.get('/posts/:id', [BlogController, 'show']) // View single post
  })
  .prefix('/api/blog')

// Protected blog routes (authentication required for write operations)
router
  .group(() => {
    router.post('/posts', [BlogController, 'store']) // Create new post
    router.put('/posts/:id', [BlogController, 'update']) // Update post (author only)
    router.delete('/posts/:id', [BlogController, 'destroy']) // Delete post (author only)
  })
  .prefix('/api/blog')
  .middleware(middleware.auth())
