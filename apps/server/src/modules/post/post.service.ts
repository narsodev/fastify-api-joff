import { NotFoundException } from '@joff/api-exceptions'

import type { User } from '../user/user.types.js'
import type { PostCreateDTO, PostResponseDTO } from './post.schemas.js'
import type { Post, PostCreate } from './post.types.js'
import type { PostRepository } from './repositories/post.repository.js'

export default class PostService {
  private readonly postRepository: PostRepository

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  async getAll({
    authorId
  }: {
    authorId?: Post['authorId']
  }): Promise<PostResponseDTO[]> {
    return await this.postRepository.getAll({ authorId })
  }

  async getById({ id }: { id: number }): Promise<PostResponseDTO> {
    const post = await this.postRepository.getById(id)

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    return post
  }

  async create({
    data,
    loggedUser
  }: {
    data: PostCreateDTO
    loggedUser: User
  }): Promise<PostResponseDTO> {
    const postCreate: PostCreate = {
      ...data,
      authorId: loggedUser.id
    }

    const post = await this.postRepository.create(postCreate)
    return post
  }
}
