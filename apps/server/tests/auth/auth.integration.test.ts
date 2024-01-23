import { describe, expect, it, beforeEach, afterAll } from 'vitest'
import supertest from 'supertest'

import { usersMock } from '../data.js'
import { buildServer } from '../server-setup.js'

const { server: fastifyServer, db } = await buildServer()
const server = fastifyServer.getServer()
const request = supertest(server.server)

describe('"/api/auth/login" endpoint', () => {
  beforeEach(async () => {
    await db.user.deleteMany()
    await db.user.createMany({
      data: usersMock.map(({ rawPassword, ...user }) => user)
    })
  })

  afterAll(async () => {
    await fastifyServer.stop()
    await db.$disconnect()
  })

  it('should login an user with valid credentials', async () => {
    const response = await request.post('/api/auth/login').send({
      email: usersMock[0].email,
      password: usersMock[0].rawPassword
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(typeof response.body.token).toBe('string')
  })

  it('should not login an user with invalid credentials', async () => {
    const response = await request.post('/api/auth/login').send({
      email: usersMock[0].email,
      password: 'invalid-password'
    })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe(
      'Authentication failed. Invalid email or password.'
    )
  })

  it('should not login an user with invalid email', async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'invalid-email',
      password: usersMock[0].rawPassword
    })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe(
      'Authentication failed. Invalid email or password.'
    )
  })
})
