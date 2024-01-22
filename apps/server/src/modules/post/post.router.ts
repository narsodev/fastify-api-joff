import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import db from '../../db.js'
import { FastifyTypebox } from '../../server/server.types.js'
import {
  PostCreateDTO,
  PostCreateDTOSchema,
  PostResponseDTOSchema
} from './post.dto.js'
import PostPrismaRepository from './repositories/post.prisma-repository.js'
import PostService from './post.service.js'
import { FASTIFY_SCHEMA_SECURITY } from '../constants.js'

const TAGS = ['Posts']

const postRepository = new PostPrismaRepository(db)
const postService = new PostService(postRepository)

const postsRouter: FastifyPluginAsync = async (fastify: FastifyTypebox) => {
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
        tags: TAGS,
        summary: 'Get all posts'
      }
    },
    async (request, reply) => {
      const posts = await postService.getAll({
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
          404: Type.Object({
            message: Type.String()
          })
        },
        tags: TAGS,
        summary: 'Get post by id'
      }
    },
    async (request, reply) => {
      const post = await postService.getById({ id: request.params.id })

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
        tags: TAGS,
        summary: 'Create post',
        security: FASTIFY_SCHEMA_SECURITY
      },
      onRequest: fastify.authenticate
    },
    async (request, reply) => {
      const body = request.body as PostCreateDTO
      const post = await postService.create({
        data: body,
        loggedUser: request.loggedUser
      })

      reply.status(201).send(post)
    }
  )
}

export default postsRouter
