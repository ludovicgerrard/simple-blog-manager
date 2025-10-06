import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'
import { registerValidator, changePasswordValidator } from '#validators/auth'

@inject()
export default class UserController {
  constructor(private userService: UserService) {}
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const result = await this.userService.register(payload)
    return response.status(result.status).json(result.body)
  }

  async profile({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const result = await this.userService.profile(user)
    return response.status(result.status).json(result.body)
  }

  async changePassword({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(changePasswordValidator)
    const user = await auth.getUserOrFail()
    const result = await this.userService.changePassword(user, payload)
    return response.status(result.status).json(result.body)
  }
}
