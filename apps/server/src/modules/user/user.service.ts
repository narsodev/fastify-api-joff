import type { UserRepository } from './repositories/user.repository.js'
import type { UserResponseDTO, UserCreateDTO } from './user.dto.js'

export default class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async getAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getAll()

    return users
  }

  async create(input: UserCreateDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.create(input)

    return user
  }
}
