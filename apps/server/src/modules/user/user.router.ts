import multipart from '@fastify/multipart'
import { Type } from '@sinclair/typebox'
import { ApiExceptionSchema, BadRequestException } from '@joff/api-exceptions'

import { FastifyTypebox } from '../../server/server.types.js'
import { FASTIFY_SCHEMA_SECURITY } from '../constants.js'

import {
  UserCreateDTO,
  UserCreateDTOSchema,
  UserResponseDTOSchema,
  UserUpdateDTO,
  UserUpdateDTOSchema
} from './user.schemas.js'

import type { UserRepository } from './repositories/user.repository.js'
import type { FileRepository } from '../file/repositories/file.repository.js'
import UserService from './user.service.js'

export default class UserRouter {
  private readonly userService: UserService
  static tags = ['Users']

  constructor(userRepository: UserRepository, fileRepository: FileRepository) {
    this.userService = new UserService(userRepository, fileRepository)
  }

  async register(fastify: FastifyTypebox) {
    await fastify.register(multipart, { attachFieldsToBody: true })

    fastify.get(
      '/',
      {
        schema: {
          response: {
            200: Type.Array(UserResponseDTOSchema)
          },
          tags: UserRouter.tags,
          summary: 'Get all users'
        }
      },
      async (request, reply) => {
        const users = await this.userService.getAll()

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
            404: ApiExceptionSchema
          },
          tags: UserRouter.tags,
          summary: 'Get user by id'
        }
      },
      async (request, reply) => {
        const user = await this.userService.getById(request.params.id)

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
          },
          tags: UserRouter.tags,
          summary: 'Create user',
          security: FASTIFY_SCHEMA_SECURITY
        },
        onRequest: fastify.authenticate
      },
      async (request, reply) => {
        const body = request.body as UserCreateDTO
        const user = await this.userService.create({
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
            404: ApiExceptionSchema
          },
          tags: UserRouter.tags,
          summary: 'Update user by id',
          security: FASTIFY_SCHEMA_SECURITY
        },
        onRequest: fastify.authenticate
      },
      async (request, reply) => {
        const params = request.params as { id: number }
        const body = request.body as UserUpdateDTO

        const user = await this.userService.update({
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
            404: ApiExceptionSchema
          },
          tags: UserRouter.tags,
          summary: 'Delete user by id',
          security: FASTIFY_SCHEMA_SECURITY
        },
        onRequest: fastify.authenticate
      },
      async (request, reply) => {
        const params = request.params as { id: number }
        await this.userService.delete({
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
          },
          tags: UserRouter.tags,
          summary: 'Get user picture by id'
        }
      },
      async (request, reply) => {
        const params = request.params as { id: number }
        const bytes = await this.userService.getUserPicture({ id: params.id })

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
          body: {
            type: 'object',
            required: ['picture'],
            properties: {
              picture: {
                isFileType: true
              }
            }
          },
          response: {
            204: {},
            400: ApiExceptionSchema,
            404: ApiExceptionSchema
          },
          consumes: ['multipart/form-data'],
          description: 'File must be an image',
          tags: UserRouter.tags,
          summary: 'Update user picture by id',
          security: FASTIFY_SCHEMA_SECURITY
        },
        onRequest: fastify.authenticate
      },
      async (request, reply) => {
        const data = await (
          request.body as { picture: multipart.MultipartFile }
        ).picture

        if (!data) {
          throw new BadRequestException('Picture is required')
        }

        const buffer = await data.toBuffer()

        const params = request.params as { id: number }
        await this.userService.setUserPicture({
          id: params.id,
          data: buffer,
          loggedUser: request.loggedUser
        })

        reply.status(204).send()
      }
    )

    fastify.delete(
      '/:id/picture',
      {
        schema: {
          params: Type.Object({
            id: Type.Number()
          }),
          response: {
            204: {},
            404: ApiExceptionSchema
          },
          tags: UserRouter.tags,
          summary: 'Delete user picture by id',
          security: FASTIFY_SCHEMA_SECURITY
        },
        onRequest: fastify.authenticate
      },
      async (request, reply) => {
        const params = request.params as { id: number }
        await this.userService.deleteUserPicture({
          id: params.id,
          loggedUser: request.loggedUser
        })

        reply.status(204).send()
      }
    )
  }
}
