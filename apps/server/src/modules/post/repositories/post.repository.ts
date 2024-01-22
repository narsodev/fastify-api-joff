import { Post } from '../post.types.js'

export interface PostRepository {
  getAll(): Promise<Post[]>
  getById(id: Post['id']): Promise<Post | null>
  getByAuthorId(authorId: Post['authorId']): Promise<Post[]>
}
