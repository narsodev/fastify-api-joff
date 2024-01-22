import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import db from '../../db.js'
import { FastifyTypebox } from '../../server/server.types.js'
import { PostResponseDTOSchema } from './post.dto.js'
import PostPrismaRepository from './repositories/post.prisma-repository.js'
import PostService from './post.service.js'

const postRepository = new PostPrismaRepository(db)
const postService = new PostService(postRepository)

const postsRouter: FastifyPluginAsync = async (fastify: FastifyTypebox) => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Array(PostResponseDTOSchema)
        }
      }
    },
    async (request, reply) => {
      const posts = await postService.getAll()

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
        }
      }
    },
    async (request, reply) => {
      const post = await postService.getById(request.params.id)

      reply.send(post)
    }
  )
}

export default postsRouter
