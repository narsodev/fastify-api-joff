import { hash } from '@joff/crypto'
import sharp from 'sharp'
import type { UserRepository } from './repositories/user.repository.js'
import type {
  UserResponseDTO,
  UserCreateDTO,
  UserUpdateDTO
} from './user.dto.js'
import { type User, type UserCreate } from './user.entity.js'
import FileRepository from '../files/file.repository.js'
import config from '../../config.js'
import { requireAdmin, requireSelfOrAdmin } from './user.utils.js'
import { IMAGE_FILE_EXTENSION } from '../constants.js'
import { NotFoundException } from '@joff/api-exceptions'

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
      throw new NotFoundException('User not found')
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
    requireAdmin(loggedUser)

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
    requireSelfOrAdmin(loggedUser, id)

    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

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
    requireSelfOrAdmin(loggedUser, id)

    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userRepository.delete(id)
  }

  async getUserPicture({ id }: { id: User['id'] }): Promise<Uint8Array> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const fr = new FileRepository()

    const bytes = await fr.download(this.getUserPictureFileName(user))
    if (!bytes) {
      throw new NotFoundException('File not found')
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
    requireSelfOrAdmin(loggedUser, id)

    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const image = await sharp(data)
      .resize(200, 200, { fit: 'cover' })
      .webp()
      .toBuffer()

    const fr = new FileRepository()
    await fr.upload(image, this.getUserPictureFileName(user))
  }

  async deleteUserPicture({
    id,
    loggedUser
  }: {
    id: User['id']
    loggedUser: User
  }): Promise<void> {
    requireSelfOrAdmin(loggedUser, id)
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const fr = new FileRepository()
    await fr.delete(this.getUserPictureFileName(user))
  }

  getUserPictureFileName(user: User): string {
    return `${user.id}.${IMAGE_FILE_EXTENSION}`
  }
}
