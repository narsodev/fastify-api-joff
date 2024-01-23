import config from './config.js'

import FastifyServer, {
  FastifyServerDependencies
} from './server/fastify-server.js'

import db from './db.js'

import UserPrismaRepository from './modules/user/repositories/user.prisma-repository.js'
import PostPrismaRepository from './modules/post/repositories/post.prisma-repository.js'
import FileS3Repository from './modules/file/repositories/file.s3-repository.js'

const dependencies: FastifyServerDependencies = {
  userRepository: new UserPrismaRepository(db),
  fileRepository: new FileS3Repository(),
  postRepository: new PostPrismaRepository(db)
}
const server = new FastifyServer(config.server.port, dependencies)

try {
  await server.start()
} catch (error) {
  console.error(`Failed to start server on port ${config.server.port}`)
  console.error(error)
  process.exit(1)
}
