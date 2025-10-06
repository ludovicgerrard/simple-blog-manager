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
const UserController = () => import('#controllers/user_controller')
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
    router.post('/login', [AuthController, 'login'])
    router.post('/register', [UserController, 'register'])
  })
  .prefix('/api')

// Protected auth routes (authentication required)
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/profile', [UserController, 'profile'])
    router.put('/password', [UserController, 'changePassword'])
  })
  .prefix('/api')
  .middleware(middleware.auth())

// Public blog routes (reading posts)
router
  .group(() => {
    router.get('/', [BlogController, 'index']) // List all posts
    router.get('/:id', [BlogController, 'show']) // View single post
  })
  .prefix('/api/posts')

// Protected blog routes (authentication required for write operations)
router
  .group(() => {
    router.post('/', [BlogController, 'store']) // Create new post
    router.put('/:id', [BlogController, 'update']) // Update post (author only)
    router.delete('/:id', [BlogController, 'destroy']) // Delete post (author only)
  })
  .prefix('/api/posts')
  .middleware(middleware.auth())
