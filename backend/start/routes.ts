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

// Health check endpoint
router.get('/', async () => {
  return {
    message: 'User Management API',
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
