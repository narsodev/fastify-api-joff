import { compareWithHash } from '../../lib/crypto.js'
import type { UserRepository } from '../user/repositories/user.repository.js'
import type { UserResponseDTO } from '../user/user.dto.js'
import { AuthFailedException } from './auth.exceptions.js'

export default class AuthService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async login(email: string, password: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.getByEmail(email)

    if (!user) {
      throw new AuthFailedException()
    }

    const isPasswordValid = await compareWithHash(password, user.password)
    if (!isPasswordValid) {
      throw new AuthFailedException()
    }

    return user
  }
}
