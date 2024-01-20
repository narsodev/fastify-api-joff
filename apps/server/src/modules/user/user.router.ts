import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import UserPrismaRepository from './repositories/user.prisma-repository.js'
import db from '../../db.js'
import UserService from './user.service.js'
import {
  UserCreateDTOSchema,
  UserResponseDTOSchema,
  UserUpdateDTOSchema
} from './user.dto.js'
import { FastifyTypebox } from '../../server/server.types.js'

const userRepository = new UserPrismaRepository(db)
const userService = new UserService(userRepository)

const usersRouter: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
  opts
) => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Array(UserResponseDTOSchema)
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
          200: UserResponseDTOSchema
          // TODO: 404
        }
      }
    },
    async (request, reply) => {
      const user = await userService.getById(request.params.id)

      reply.send(user)
    }
  )

  fastify.post(
    '/',
    {
      schema: {
        body: UserCreateDTOSchema,
        response: {
          201: UserResponseDTOSchema
        }
      }
    },
    async (request, reply) => {
      const user = await userService.create(request.body)

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
        body: UserUpdateDTOSchema,
        response: {
          200: UserResponseDTOSchema
          // TODO: 404
        }
      }
    },
    async (request, reply) => {
      const user = await userService.update(request.params.id, request.body)

      reply.send(user)
    }
  )
}

export default usersRouter
