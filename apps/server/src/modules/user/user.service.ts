import type { UserRepository } from './repositories/user.repository.js'
import type {
  UserResponseDTO,
  UserCreateDTO,
  UserUpdateDTO
} from './user.dto.js'
import type { User } from './user.entity.js'
import { UserNotFoundException } from './user.exceptions.js'

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
    const user = await this.userRepository.create(input)

    return user
  }

  async update(id: User['id'], input: UserUpdateDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    const updatedUser = await this.userRepository.update(id, input)

    return updatedUser
  }
}
