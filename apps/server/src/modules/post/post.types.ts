import { User } from '../user/user.entity.js'

export interface Post {
  id: number
  title: string
  content: string
  authorId: User['id']
  createdAt: Date
  updatedAt: Date
}

export interface PostCreate {
  title: string
  content: string
  authorId: User['id']
}
