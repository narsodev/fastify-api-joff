import { FastifyPluginAsync } from 'fastify'
import db from '../db.js'

const usersRouter: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    reply.send(db.user.findMany())
  })
}

export default usersRouter
