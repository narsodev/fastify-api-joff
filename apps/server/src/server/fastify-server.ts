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
import postsRouter from '../modules/post/post.router.js'
import { ajvFilePlugin } from './server.plugins.js'
import { ApiException } from '@joff/api-exceptions'

export default class FastifyServer {
  private server = fastify({
    ajv: {
      plugins: [ajvFilePlugin]
    },
    logger: true
  }).withTypeProvider<TypeBoxTypeProvider>()
  private port: number

  constructor(port: number) {
    this.port = port
  }

  async start() {
    this.addErrorHandler()
    await this.addAuth()
    await this.addSwagger()
    await this.addRoutes()

    await this.server.ready()

    await this.server.listen({ port: this.port })
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
          version: config.swagger.version,
          contact: {
            name: config.swagger.contact.name,
            url: config.swagger.contact.url,
            email: config.swagger.contact.email
          }
        },
        securityDefinitions: {
          'Bearer Token': {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: config.swagger.authTokenDescription
          }
        }
      }
    })

    await this.server.register(swaggerUi, {
      routePrefix: config.swagger.route
    })
  }

  addErrorHandler() {
    this.server.setErrorHandler((error, request, reply) => {
      if (error instanceof ApiException) {
        reply.status(error.code).send({ message: error.message })
        return
      }
      reply.send(error)
    })
  }

  async addRoutes() {
    await this.server.register(authRouter, { prefix: '/api/auth' })
    await this.server.register(usersRouter, { prefix: '/api/users' })
    await this.server.register(postsRouter, { prefix: '/api/posts' })
  }
}
