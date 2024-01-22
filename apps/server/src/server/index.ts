import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import usersRouter from '../modules/user/user.router.js'
import config from '../config.js'
import authRouter from '../modules/auth/auth.router.js'

export default class Server {
  private server = fastify().withTypeProvider<TypeBoxTypeProvider>()
  private port: number

  constructor(port: number) {
    this.port = port
  }

  async start() {
    this.server.get('/ping', () => {
      return 'pong\n'
    })

    await this.server.register(jwt, { secret: config.auth.jwtSecret })

    await this.server.register(swagger, {
      swagger: {
        info: {
          title: 'Fastify API',
          description: 'Fastify API for technical assessment',
          version: '0.1.0'
        }
      }
    })

    await this.server.register(swaggerUi, {
      routePrefix: '/api/docs'
    })

    await this.server.register(usersRouter, { prefix: '/api/users' })
    await this.server.register(authRouter, { prefix: '/api/auth' })

    await this.server.ready()

    await this.server.listen({ port: this.port })
  }
}
