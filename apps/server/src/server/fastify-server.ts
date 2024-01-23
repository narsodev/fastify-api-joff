import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { ApiException } from '@joff/api-exceptions'

import config from '../config.js'
import { ajvFilePlugin } from './server.plugins.js'

import { decorateWithAuth } from '../modules/auth/auth.fastify-utils.js'
import { UserRepository } from '../modules/user/repositories/user.repository.js'
import { type FileRepository } from '../modules/file/repositories/file.repository.js'
import UserRouter from '../modules/user/user.router.js'
import PostRouter from '../modules/post/post.router.js'
import { PostRepository } from '../modules/post/repositories/post.repository.js'
import AuthRouter from '../modules/auth/auth.router.js'

export interface FastifyServerDependencies {
  userRepository: UserRepository
  fileRepository: FileRepository
  postRepository: PostRepository
}

export default class FastifyServer {
  private readonly server = fastify({
    ajv: {
      plugins: [ajvFilePlugin]
    },
    logger: process.env.NODE_ENV !== 'test'
  }).withTypeProvider<TypeBoxTypeProvider>()

  private readonly port: number
  private readonly host = '0.0.0.0'
  private readonly dependencies: FastifyServerDependencies

  constructor(port: number, dependencies: FastifyServerDependencies) {
    this.port = port
    this.dependencies = dependencies
  }

  async start() {
    this.addErrorHandler()
    await this.addAuth()
    await this.addSwagger()
    await this.addRoutes()

    await this.server.ready()

    await this.server.listen({ port: this.port, host: this.host })
  }

  async addAuth() {
    await this.server.register(jwt, { secret: config.auth.jwtSecret })
    await decorateWithAuth(this.server, this.dependencies.userRepository)
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
    const authRouter = new AuthRouter(this.dependencies.userRepository)
    await this.server.register((fastify) => authRouter.register(fastify), {
      prefix: '/api/auth'
    })

    const userRouter = new UserRouter(
      this.dependencies.userRepository,
      this.dependencies.fileRepository
    )
    await this.server.register((fastify) => userRouter.register(fastify), {
      prefix: '/api/users'
    })

    const postRouter = new PostRouter(this.dependencies.postRepository)
    await this.server.register((fastify) => postRouter.register(fastify), {
      prefix: '/api/posts'
    })
  }

  getServer() {
    return this.server
  }

  stop() {
    this.server.close()
  }
}
