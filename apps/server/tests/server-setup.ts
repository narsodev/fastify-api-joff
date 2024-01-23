import { PrismaClient } from '@prisma/client'

import FastifyServer from '../src/server/fastify-server'

import FileDummyRepository from './dummies/file.dummy-repository'
import UserPrismaRepository from '../src/modules/user/repositories/user.prisma-repository'
import PostPrismaRepository from '../src/modules/post/repositories/post.prisma-repository'

export const buildServer = async () => {
  const db = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL ?? ''
      }
    }
  })

  const port = Number(process.env.TEST_PORT ?? 3000)
  if (Number.isNaN(port)) {
    throw new Error('Invalid port')
  }

  const fastifyServer = new FastifyServer(port, {
    fileRepository: new FileDummyRepository(),
    userRepository: new UserPrismaRepository(db),
    postRepository: new PostPrismaRepository(db)
  })

  await fastifyServer.start()

  return {
    server: fastifyServer,
    port,
    db
  }
}
