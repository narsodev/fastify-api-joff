import { PrismaClient, User } from '@prisma/client'
import type { UserCreate } from '../user.entity.js'
import type { UserRepository } from './user.repository.js'

export default class UserPrismaRepository implements UserRepository {
  private readonly db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  async getAll(): Promise<User[]> {
    return this.db.user.findMany()
  }

  async create({ name, email }: UserCreate): Promise<User> {
    return this.db.user.create({
      data: {
        name,
        email
      }
    })
  }
}
