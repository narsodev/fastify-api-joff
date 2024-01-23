import { compareWithHash } from '@joff/crypto'
import { UnauthorizedException } from '@joff/api-exceptions'

import type { UserRepository } from '../user/repositories/user.repository.js'
import type { UserResponseDTO } from '../user/user.schemas.js'

export default class AuthService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async login(email: string, password: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.getByEmail(email)

    if (!user) {
      throw new UnauthorizedException(
        'Authentication failed. Invalid email or password.'
      )
    }

    const isPasswordValid = await compareWithHash(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Authentication failed. Invalid email or password.'
      )
    }

    return user
  }
}
