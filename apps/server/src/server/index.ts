import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import usersRouter from '../modules/user/user.router.js'
import config from '../config.js'
import authRouter from '../modules/auth/auth.router.js'
import { decorateWithAuth } from '../modules/auth/auth.fastify-utils.js'
import UserPrismaRepository from '../modules/user/repositories/user.prisma-repository.js'
import db from '../db.js'

export default class Server {
  private server = fastify().withTypeProvider<TypeBoxTypeProvider>()
  private port: number

  constructor(port: number) {
    this.port = port
  }

  async addAuth() {
    await this.server.register(jwt, { secret: config.auth.jwtSecret })
    await decorateWithAuth(this.server, new UserPrismaRepository(db))
  }

  async addSwagger() {
    await this.server.register(swagger, {
      swagger: {
        info: {
          title: config.swagger.name,
          description: config.swagger.description,
          version: config.swagger.version
        }
      }
    })

    await this.server.register(swaggerUi, {
      routePrefix: config.swagger.route
    })
  }

  async addRoutes() {
    await this.server.register(usersRouter, { prefix: '/api/users' })
    await this.server.register(authRouter, { prefix: '/api/auth' })
  }

  async start() {
    await this.addAuth()
    await this.addSwagger()
    await this.addRoutes()

    await this.server.ready()

    await this.server.listen({ port: this.port })
  }
}
