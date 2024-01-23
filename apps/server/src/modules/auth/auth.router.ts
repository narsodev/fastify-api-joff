import { Type } from '@sinclair/typebox'
import { ApiExceptionSchema } from '@joff/api-exceptions'

import type { FastifyTypebox } from '../../server/server.types.js'

import { UserRepository } from '../user/repositories/user.repository.js'
import AuthService from './auth.service.js'

export default class AuthRouter {
  private readonly authService: AuthService

  static tags = ['Auth']

  constructor(userRepository: UserRepository) {
    this.authService = new AuthService(userRepository)
  }

  async register(fastify: FastifyTypebox) {
    fastify.post(
      '/login',
      {
        schema: {
          body: Type.Object({
            email: Type.String(),
            password: Type.String()
          }),
          response: {
            200: Type.Object({
              token: Type.String()
            }),
            401: ApiExceptionSchema
          },
          tags: AuthRouter.tags,
          summary: 'Login'
        }
      },
      async (request, reply) => {
        const { email, password } = request.body

        const user = await this.authService.login(email, password)

        const token = fastify.jwt.sign({
          id: user.id,
          name: user.name,
          email: user.email
        })
        reply.send({ token })
      }
    )
  }
}
