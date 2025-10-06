import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AuthService from '#services/auth_service'
import { loginValidator } from '#validators/auth'

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const result = await this.authService.login(payload)
    return response.status(result.status).json(result.body)
  }

  async logout({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const token = auth.user?.currentAccessToken
    const result = await this.authService.logout(user, token)
    return response.status(result.status).json(result.body)
  }
}
