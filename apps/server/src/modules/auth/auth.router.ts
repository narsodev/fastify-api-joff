import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import type { FastifyTypebox } from '../../server/server.types.js'
import AuthService from './auth.service.js'
import UserPrismaRepository from '../user/repositories/user.prisma-repository.js'
import db from '../../db.js'
import { ApiExceptionSchema } from '@joff/api-exceptions'

const TAGS = ['Auth']

const userRepository = new UserPrismaRepository(db)
const authService = new AuthService(userRepository)

const authRouter: FastifyPluginAsync = async (fastify: FastifyTypebox) => {
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
        tags: TAGS,
        summary: 'Login'
      }
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await authService.login(email, password)

      const token = fastify.jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email
      })
      reply.send({ token })
    }
  )
}

export default authRouter
