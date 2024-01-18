import fastify from 'fastify'

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

    await this.server.listen({ port: this.port })
  }
}
