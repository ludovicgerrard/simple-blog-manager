import { inject } from '@adonisjs/core'

import UserRepository from '#repositories/user_repository'

@inject()
export default class AuthService {
  constructor(private users: UserRepository) {}
  async login(payload) {
    try {
      const userLogged = await this.users.verifyCredentials(payload.email, payload.password)
      const token = await this.users.createToken(userLogged)

      return {
        status: 200,
        body: {
          success: true,
          message: 'Login successful',
          data: {
            user: userLogged.getUserInfo(),
            token: {
              type: 'Bearer',
              value: token.value!.release(),
            },
          },
        },
      }
    } catch {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Invalid credentials',
        },
      }
    }
  }

  async logout(user, token) {
    if (token) {
      await this.users.revokeToken(user, token.identifier)
    }
    return {
      status: 200,
      body: {
        success: true,
        message: 'Logged out successfully',
      },
    }
  }
}
