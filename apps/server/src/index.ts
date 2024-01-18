import config from './config.js'
import Server from './server.js'

const server = new Server(config.server.port)

try {
  await server.start()
  console.log(`Server running on port ${config.server.port}`)
} catch (error) {
  console.error(`Failed to start server on port ${config.server.port}`)
  console.error(error)
  process.exit(1)
}
