import { inject } from '@adonisjs/core'

import UserRepository from '#repositories/user_repository'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';

@inject()
export default class UserService {
  constructor(private users: UserRepository) {}

  async register(payload: { fullName: string; email: string; password: string }) {
    const existingUser = await this.users.findByEmail(payload.email)
    if (existingUser) {
      return {
        status: 409,
        body: {
          success: false,
          message: 'User with this email already exists',
        },
      }
    }

    const user = await this.users.create(payload)
    const token = await this.users.createToken(user)

    return {
      status: 201,
      body: {
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.getUserInfo(),
          token: {
            type: 'Bearer',
            value: token.value!.release(),
          },
        },
      },
    }
  }

  async profile(user: User & { currentAccessToken: AccessToken; }) {
    return {
      status: 200,
      body: {
        success: true,
        data: {
          user: user.getUserInfo(),
        },
      },
    }
  }

  async changePassword(user: User, payload: { currentPassword: string; newPassword: string; }) {
    const isValid = await hash.verify(user.password, payload.currentPassword)
    if (!isValid) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Current password is incorrect',
        },
      }
    }

    await this.users.changePassword(user, payload.newPassword)

    return {
      status: 200,
      body: {
        success: true,
        message: 'Password changed successfully',
      },
    }
  }
}
