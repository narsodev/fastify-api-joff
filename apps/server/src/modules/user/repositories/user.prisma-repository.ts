import { PrismaClient } from '@prisma/client'
import type { User, UserCreate, UserUpdate } from '../user.entity.js'
import type { UserRepository } from './user.repository.js'

export default class UserPrismaRepository implements UserRepository {
  private readonly db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  async getAll(): Promise<User[]> {
    return this.db.user.findMany()
  }

  async getById(id: User['id']): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        id
      }
    })
  }

  async getByEmail(email: User['email']): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        email
      }
    })
  }

  async create(data: UserCreate): Promise<User> {
    return this.db.user.create({
      data
    })
  }

  async update(id: User['id'], data: UserUpdate): Promise<User> {
    return this.db.user.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: User['id']): Promise<void> {
    await this.db.user.delete({
      where: {
        id
      }
    })
  }
}
