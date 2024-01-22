import config from './config.js'
import FastifyServer from './server/fastify-server.js'

const server = new FastifyServer(config.server.port)

try {
  await server.start()
} catch (error) {
  console.error(`Failed to start server on port ${config.server.port}`)
  console.error(error)
  process.exit(1)
}
