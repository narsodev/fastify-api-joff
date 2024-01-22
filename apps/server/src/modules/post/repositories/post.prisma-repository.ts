import { PrismaClient } from '@prisma/client'
import type { PostRepository } from './post.repository.js'
import type { Post, PostCreate } from '../post.types.js'

export default class PostPrismaRepository implements PostRepository {
  private readonly db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  async getAll({ authorId }: { authorId?: Post['authorId'] }): Promise<Post[]> {
    return await this.db.post.findMany({ where: { authorId } })
  }

  async getById(id: Post['id']): Promise<Post | null> {
    return await this.db.post.findUnique({ where: { id } })
  }

  async getByAuthorId(authorId: Post['authorId']): Promise<Post[]> {
    return await this.db.post.findMany({ where: { authorId } })
  }

  async create(data: PostCreate): Promise<Post> {
    return await this.db.post.create({ data })
  }
}
