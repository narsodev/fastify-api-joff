import { hash } from '@joff/crypto'
import type { UserRepository } from './repositories/user.repository.js'
import type {
  UserResponseDTO,
  UserCreateDTO,
  UserUpdateDTO
} from './user.dto.js'
import { UserRoles, type User, type UserCreate } from './user.entity.js'
import { UserNotFoundException } from './user.exceptions.js'
import FileRepository from '../files/file.repository.js'
import config from '../../config.js'
import ForbiddenException from '../../exceptions/ForbiddenException.js'

export default class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async getAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getAll()

    return users
  }

  async getById(id: User['id']): Promise<UserResponseDTO> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    return user
  }

  async create({
    data,
    loggedUser
  }: {
    data: UserCreateDTO
    loggedUser: User
  }): Promise<UserResponseDTO> {
    this.requireAdmin(loggedUser)

    const createData: UserCreate = { ...data }
    createData.password = await hash(data.password, config.auth.hashRrounds)

    const user = await this.userRepository.create(createData)

    return user
  }

  async update({
    id,
    data,
    loggedUser
  }: {
    id: User['id']
    data: UserUpdateDTO
    loggedUser: User
  }): Promise<UserResponseDTO> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    this.requireSelfOrAdmin(loggedUser, id)

    const updatedUser = await this.userRepository.update(id, data)

    return updatedUser
  }

  async delete({
    id,
    loggedUser
  }: {
    id: User['id']
    loggedUser: User
  }): Promise<void> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    this.requireSelfOrAdmin(loggedUser, id)

    await this.userRepository.delete(id)
  }

  async getUserPicture({ id }: { id: User['id'] }): Promise<Uint8Array> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    const fr = new FileRepository()

    const bytes = await fr.download(`${user.id}.jpg`)
    if (!bytes) {
      throw new Error('File not found')
    }

    return bytes
  }

  async setUserPicture({
    id,
    data,
    loggedUser
  }: {
    id: User['id']
    data: Buffer
    loggedUser: User
  }): Promise<any> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    this.requireSelfOrAdmin(loggedUser, id)

    const fr = new FileRepository()
    await fr.upload(data, `${user.id}.jpg`)
  }

  requireAdmin(user: User): void {
    if (user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException()
    }
  }

  requireSelfOrAdmin(user: User, id: User['id']): void {
    if (user.role !== UserRoles.ADMIN && user.id !== id) {
      throw new ForbiddenException()
    }
  }
}
