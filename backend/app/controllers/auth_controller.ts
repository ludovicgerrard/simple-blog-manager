import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from '#validators/auth'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      // Check if user already exists
      const existingUser = await User.findBy('email', payload.email)
      if (existingUser) {
        return response.status(409).json({
          success: false,
          message: 'User with this email already exists',
        })
      }

      // Create the user
      const user = await User.create(payload)

      // Generate access token
      const token = await User.accessTokens.create(user)

      return response.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
          },
          token: {
            type: 'Bearer',
            value: token.value!.release(),
          },
        },
      })
    } catch (error) {
      // Let validation errors bubble up for proper 422 response
      if (error.code === 'E_VALIDATION_ERROR') {
        throw error
      }
      
      return response.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      })
    }
  }

  /**
   * Login user
   */
  async login({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginValidator)

      // Verify user credentials
      const user = await User.verifyCredentials(payload.email, payload.password)

      // Generate access token
      const token = await User.accessTokens.create(user)

      return response.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
          },
          token: {
            type: 'Bearer',
            value: token.value!.release(),
          },
        },
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }
  }

  /**
   * Logout user (revoke current token)
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const token = auth.user?.currentAccessToken

      if (token) {
        await User.accessTokens.delete(user, token.identifier)
      }

      return response.json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Logout failed',
      })
    }
  }

  /**
   * Get current user profile
   */
  async profile({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      return response.json({
        success: true,
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }
  }

  /**
   * Update user profile
   */
  async updateProfile({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updateProfileValidator)

      user.merge(payload)
      await user.save()

      return response.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      })
    } catch (error) {
      // Let validation errors bubble up for proper 422 response
      if (error.code === 'E_VALIDATION_ERROR') {
        throw error
      }
      
      return response.status(500).json({
        success: false,
        message: 'Profile update failed',
        error: error.message,
      })
    }
  }

  /**
   * Change user password
   */
  async changePassword({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(changePasswordValidator)

      // Verify current password
      const isCurrentPasswordValid = await hash.verify(user.password, payload.currentPassword)
      if (!isCurrentPasswordValid) {
        return response.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        })
      }

      // Update password
      user.password = payload.newPassword
      await user.save()

      return response.json({
        success: true,
        message: 'Password changed successfully',
      })
    } catch (error) {
      // Let validation errors bubble up for proper 422 response
      if (error.code === 'E_VALIDATION_ERROR') {
        throw error
      }
      
      return response.status(500).json({
        success: false,
        message: 'Password change failed',
        error: error.message,
      })
    }
  }
}
