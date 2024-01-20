import { FastifyPluginAsync } from 'fastify'
import UserPrismaRepository from './repositories/user.prisma-repository.js'
import db from '../../db.js'
import UserService from './user.service.js'

const userRepository = new UserPrismaRepository(db)
const userService = new UserService(userRepository)

const usersRouter: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    const users = await userService.getAll()

    reply.send(users)
  })

  fastify.get('/:id', async (request, reply) => {
    const user = await userService.getById(Number((request.params as any).id))

    reply.send(user)
  })

  fastify.post('/', async (request, reply) => {
    const user = await userService.create(request.body as any)

    reply.send(user)
  })

  fastify.patch('/:id', async (request, reply) => {
    const user = await userService.update(
      Number((request.params as any).id),
      request.body as any
    )

    reply.send(user)
  })
}

export default usersRouter
