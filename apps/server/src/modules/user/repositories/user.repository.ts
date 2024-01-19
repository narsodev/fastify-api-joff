import type { User, UserCreate } from '../user.entity.js'

export interface UserRepository {
  getAll(): Promise<User[]>
  create(user: UserCreate): Promise<User>
}
