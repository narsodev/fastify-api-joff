import { Type } from '@sinclair/typebox'
import { ApiExceptionSchema } from '@joff/api-exceptions'

import { FASTIFY_SCHEMA_SECURITY } from '../constants.js'
import { FastifyTypebox } from '../../server/server.types.js'

import {
  PostCreateDTO,
  PostCreateDTOSchema,
  PostResponseDTOSchema
} from './post.schemas.js'

import PostService from './post.service.js'
import { PostRepository } from './repositories/post.repository.js'

export default class PostRouter {
  private readonly postService: PostService
  static tags = ['Posts']

  constructor(postRepository: PostRepository) {
    this.postService = new PostService(postRepository)
  }

  async register(fastify: FastifyTypebox) {
    fastify.get(
      '/',
      {
        schema: {
          response: {
            200: Type.Array(PostResponseDTOSchema)
          },
          querystring: Type.Object({
            authorId: Type.Optional(Type.Number())
          }),
          tags: PostRouter.tags,
          summary: 'Get all posts'
        }
      },
      async (request, reply) => {
        const posts = await this.postService.getAll({
          authorId: request.query.authorId
        })

        reply.send(posts)
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
            200: PostResponseDTOSchema,
            404: ApiExceptionSchema
          },
          tags: PostRouter.tags,
          summary: 'Get post by id'
        }
      },
      async (request, reply) => {
        const post = await this.postService.getById({ id: request.params.id })

        reply.send(post)
      }
    )

    fastify.post(
      '/',
      {
        schema: {
          body: PostCreateDTOSchema,
          response: {
            201: PostResponseDTOSchema
          },
          tags: PostRouter.tags,
          summary: 'Create post',
          security: FASTIFY_SCHEMA_SECURITY
        },
        onRequest: fastify.authenticate
      },
      async (request, reply) => {
        const body = request.body as PostCreateDTO
        const post = await this.postService.create({
          data: body,
          loggedUser: request.loggedUser
        })

        reply.status(201).send(post)
      }
    )
  }
}
