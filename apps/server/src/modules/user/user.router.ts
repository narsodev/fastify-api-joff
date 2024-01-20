import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import UserPrismaRepository from './repositories/user.prisma-repository.js'
import db from '../../db.js'
import UserService from './user.service.js'

const userRepository = new UserPrismaRepository(db)
const userService = new UserService(userRepository)

const usersRouter: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Number(),
              name: Type.String(),
              email: Type.String()
            })
          )
        }
      }
    },
    async (request, reply) => {
      const users = await userService.getAll()

      reply.send(users)
    }
  )

  fastify.get(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        response: {
          200: Type.Object({
            id: Type.Number(),
            name: Type.String(),
            email: Type.String()
          })
          // TODO: 404
        }
      }
    },
    async (request, reply) => {
      const user = await userService.getById(Number((request.params as any).id))

      reply.send(user)
    }
  )

  fastify.post(
    '/',
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
          email: Type.String()
        }),
        response: {
          201: Type.Object({
            id: Type.Number(),
            name: Type.String(),
            email: Type.String()
          })
        }
      }
    },
    async (request, reply) => {
      const user = await userService.create(request.body as any)

      reply.status(201).send(user)
    }
  )

  fastify.patch(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        body: Type.Object({
          name: Type.Optional(Type.String()),
          email: Type.Optional(Type.String())
        }),
        response: {
          200: Type.Object({
            id: Type.Number(),
            name: Type.String(),
            email: Type.String()
          })
          // TODO: 404
        }
      }
    },
    async (request, reply) => {
      const user = await userService.update(
        Number((request.params as any).id),
        request.body as any
      )

      reply.send(user)
    }
  )
}

export default usersRouter
