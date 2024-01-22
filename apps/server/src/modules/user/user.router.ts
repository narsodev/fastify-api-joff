import type { FastifyPluginAsync } from 'fastify'
import multipart from '@fastify/multipart'
import { Type } from '@sinclair/typebox'
import UserPrismaRepository from './repositories/user.prisma-repository.js'
import db from '../../db.js'
import UserService from './user.service.js'
import {
  UserCreateDTO,
  UserCreateDTOSchema,
  UserResponseDTOSchema,
  UserUpdateDTO,
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
      },
      onRequest: fastify.authenticate
    },
    async (request, reply) => {
      const body = request.body as UserCreateDTO
      const user = await userService.create({
        data: body,
        loggedUser: request.loggedUser
      })

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
      },
      onRequest: fastify.authenticate
    },
    async (request, reply) => {
      const params = request.params as { id: number }
      const body = request.body as UserUpdateDTO

      const user = await userService.update({
        id: params.id,
        data: body,
        loggedUser: request.loggedUser
      })

      reply.send(user)
    }
  )

  fastify.delete(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        response: {
          204: {},
          404: Type.Object({
            message: Type.String()
          })
        }
      },
      onRequest: fastify.authenticate
    },
    async (request, reply) => {
      const params = request.params as { id: number }
      await userService.delete({
        id: params.id,
        loggedUser: request.loggedUser
      })

      reply.status(204).send()
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
      const params = request.params as { id: number }
      const bytes = await userService.getUserPicture({ id: params.id })

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
      },
      onRequest: fastify.authenticate
    },
    async (request, reply) => {
      const data = await request.file()

      if (!data) {
        throw new Error('File is required')
      }

      const buffer = await data.toBuffer()

      const params = request.params as { id: number }
      await userService.setUserPicture({
        id: params.id,
        data: buffer,
        loggedUser: request.loggedUser
      })

      reply.send()
    }
  )
}

export default usersRouter
