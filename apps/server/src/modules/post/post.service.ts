import { Post } from './post.types.js'
import type { PostRepository } from './repositories/post.repository.js'

export default class PostService {
  private readonly postRepository: PostRepository

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  async getAll(): Promise<Post[]> {
    return await this.postRepository.getAll()
  }

  async getById(id: number): Promise<Post> {
    const post = await this.postRepository.getById(id)

    if (!post) {
      throw new Error('Post not found')
    }

    return post
  }

  async getByAuthorId(authorId: Post['authorId']): Promise<Post[]> {
    const posts = await this.postRepository.getByAuthorId(authorId)

    return posts
  }
}
