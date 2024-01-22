import { Post, PostCreate } from '../post.types.js'

export interface PostRepository {
  getAll({ authorId }: { authorId?: Post['authorId'] }): Promise<Post[]>
  getById(id: Post['id']): Promise<Post | null>
  create(data: PostCreate): Promise<Post>
}
