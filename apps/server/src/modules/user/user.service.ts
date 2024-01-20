import type { UserRepository } from './repositories/user.repository.js'
import type { UserResponseDTO, UserCreateDTO } from './user.dto.js'
import type { User } from './user.entity.js'

export default class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async getAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getAll()

    return users
  }

  async getById(id: User['id']): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.getById(id)

    return user
  }

  async create(input: UserCreateDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.create(input)

    return user
  }

  async update(id: User['id'], input: UserCreateDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.update(id, input)

    return user
  }
}
