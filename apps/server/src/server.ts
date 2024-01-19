import fastify from 'fastify'
import usersRouter from './modules/user/user.router.js'

export default class Server {
  private server = fastify()
  private port: number

  constructor(port: number) {
    this.port = port
  }

  async start() {
    this.server.get('/ping', () => {
      return 'pong\n'
    })

    this.server.register(usersRouter, { prefix: '/api/users' })

    await this.server.listen({ port: this.port })
  }
}
