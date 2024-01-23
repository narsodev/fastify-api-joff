import sharp from 'sharp'
import { hash } from '@joff/crypto'
import { NotFoundException } from '@joff/api-exceptions'

import config from '../../config.js'
import { IMAGE_FILE_EXTENSION } from '../constants.js'

import type {
  UserResponseDTO,
  UserCreateDTO,
  UserUpdateDTO
} from './user.schemas.js'
import type { User, UserCreate } from './user.types.js'

import { requireAdmin, requireSelfOrAdmin } from './user.utils.js'

import type { UserRepository } from './repositories/user.repository.js'
import type { FileRepository } from '../file/repositories/file.repository.js'

export default class UserService {
  private readonly userRepository: UserRepository
  private readonly fileRepository: FileRepository

  constructor(userRepository: UserRepository, fileRepository: FileRepository) {
    this.userRepository = userRepository
    this.fileRepository = fileRepository
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

    const bytes = await this.fileRepository.download(
      this.getUserPictureFileName(user)
    )
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

    await this.fileRepository.upload(image, this.getUserPictureFileName(user))
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

    await this.fileRepository.delete(this.getUserPictureFileName(user))
  }

  getUserPictureFileName(user: User): string {
    return `${user.id}.${IMAGE_FILE_EXTENSION}`
  }
}
