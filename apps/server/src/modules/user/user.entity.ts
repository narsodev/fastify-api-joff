export interface User {
  id: number
  name: string
  password: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface UserCreate {
  name: string
  email: string
  password: string
}

export interface UserUpdate {
  name?: string
  email?: string
}
