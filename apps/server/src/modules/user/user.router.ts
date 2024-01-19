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

  fastify.post('/', async (request, reply) => {
    const user = await userService.create(request.body as any)

    reply.send(user)
  })
}

export default usersRouter
