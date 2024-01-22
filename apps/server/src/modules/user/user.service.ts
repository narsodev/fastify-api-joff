import { hash } from '@joff/crypto'
import type { UserRepository } from './repositories/user.repository.js'
import type {
  UserResponseDTO,
  UserCreateDTO,
  UserUpdateDTO
} from './user.dto.js'
import type { User } from './user.entity.js'
import { UserNotFoundException } from './user.exceptions.js'
import FileRepository from '../files/file.repository.js'
import config from '../../config.js'

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

  async create(input: UserCreateDTO): Promise<UserResponseDTO> {
    const data = { ...input }
    data.password = await hash(data.password, config.auth.hashRrounds)

    const user = await this.userRepository.create(data)

    return user
  }

  async update(
    id: User['id'],
    { data, loggedUser }: { data: UserUpdateDTO; loggedUser: User }
  ): Promise<UserResponseDTO> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    if (user.id !== loggedUser.id) {
      // TODO: throw forbidden error
      throw new Error('Forbidden')
    }

    const updatedUser = await this.userRepository.update(id, data)

    return updatedUser
  }

  async delete(id: User['id']): Promise<void> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    await this.userRepository.delete(id)
  }

  async getUserPicture(id: User['id']): Promise<Uint8Array> {
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

  async setUserPicture(id: User['id'], data: Buffer): Promise<any> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    const fr = new FileRepository()

    await fr.upload(data, `${user.id}.jpg`)
  }
}
