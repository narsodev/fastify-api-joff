import { FastifyPluginAsync } from 'fastify'
import multipart from '@fastify/multipart'
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
import { UserNotFoundException } from './user.exceptions.js'

const userRepository = new UserPrismaRepository(db)
const userService = new UserService(userRepository)

const usersRouter: FastifyPluginAsync = async (fastify: FastifyTypebox) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof UserNotFoundException) {
      reply.status(404).send({
        message: error.message
      })
      return
    }

    reply.send(error)
  })

  fastify.register(multipart)

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
          200: UserResponseDTOSchema,
          404: Type.Object({
            message: Type.String()
          })
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
          200: UserResponseDTOSchema,
          404: Type.Object({
            message: Type.String()
          })
        }
      }
    },
    async (request, reply) => {
      const user = await userService.update(request.params.id, request.body)

      reply.send(user)
    }
  )

  fastify.get(
    '/:id/picture',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        response: {
          200: {
            type: 'string',
            format: 'binary'
          },
          404: Type.Object({
            message: Type.String()
          })
        }
      }
    },
    async (request, reply) => {
      const bytes = await userService.getUserPicture(request.params.id)

      reply.type('image/jpg').send(bytes)
    }
  )

  fastify.put(
    '/:id/picture',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        response: {
          200: {},
          404: Type.Object({
            message: Type.String()
          })
        }
      }
    },
    async (request, reply) => {
      const data = await request.file()

      if (!data) {
        throw new Error('File is required')
      }

      const buffer = await data.toBuffer()

      await userService.setUserPicture(request.params.id, buffer)

      reply.send()
    }
  )
}

export default usersRouter
