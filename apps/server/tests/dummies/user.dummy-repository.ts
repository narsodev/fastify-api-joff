import { UserRepository } from '../../src/modules/user/repositories/user.repository'
import { User, UserCreate, UserUpdate } from '../../src/modules/user/user.types'

export default class UserDummyRepository implements UserRepository {
  users: User[] = []

  constructor(users: User[] = []) {
    this.users = users
  }

  async getAll(): Promise<User[]> {
    return this.users
  }

  async getById(id: User['id']): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  async getByEmail(email: User['email']): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async create(data: UserCreate): Promise<User> {
    const user = {
      ...data,
      id: new Date().getTime(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.users.push(user)
    return user
  }

  async update(id: User['id'], data: UserUpdate): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id)
    this.users[index] = { ...this.users[index], updatedAt: new Date(), ...data }
    return this.users[index]
  }

  async delete(id: User['id']): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id)
  }
}
