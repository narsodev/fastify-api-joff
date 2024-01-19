export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface UserCreate {
  name: string
  email: string
}
