import { Value } from '@sinclair/typebox/value'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UserRepository } from '../user/repositories/user.repository.js'
import { UserTokenSchema } from './auth.schemas.js'
import { User } from '../user/user.entity.js'
import { UnauthorizedException } from '@joff/api-exceptions'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
  }

  interface FastifyRequest {
    loggedUser: User
  }
}

export const decorateWithAuth = (
  fastify: FastifyInstance,
  userRepository: UserRepository
) => {
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      await request.jwtVerify()
      const tokenIsValid = Value.Check(UserTokenSchema, request.user)
      if (!tokenIsValid) {
        throw new UnauthorizedException()
      }

      const user = Value.Decode(UserTokenSchema, request.user)

      const loggedUser = await userRepository.getById(user.id)
      if (!loggedUser) {
        reply.status(401).send({
          message: 'Unauthorized'
        })
        return
      }

      request.loggedUser = loggedUser
    }
  )
}
