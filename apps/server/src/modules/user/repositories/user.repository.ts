import type { User, UserCreate, UserUpdate } from '../user.types.js'

export interface UserRepository {
  getAll(): Promise<User[]>
  getById(id: User['id']): Promise<User | null>
  getByEmail(email: User['email']): Promise<User | null>
  create(data: UserCreate): Promise<User>
  update(id: User['id'], data: UserUpdate): Promise<User>
  delete(id: User['id']): Promise<void>
}
