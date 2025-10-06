import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class UserRepository {
  async findByEmail(email: string) {
    return User.findBy('email', email)
  }

  async create(data) {
    return User.create(data)
  }

  async createToken(user: User) {
    return User.accessTokens.create(user)
  }

  async revokeToken(user: User, identifier: string) {
    return User.accessTokens.delete(user, identifier)
  }

  async verifyCredentials(email: string, password: string) {
    return User.verifyCredentials(email, password)
  }

  async update(user: User, payload: Partial<User>) {
    user.merge(payload)
    await user.save()
    return user
  }

  async changePassword(user: User, newPassword: string) {
    user.password = newPassword
    await user.save()
  }
}
