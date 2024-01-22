export interface User {
  id: number
  name: string
  password: string
  email: string
  role: (typeof UserRoles)[keyof typeof UserRoles]
  createdAt: Date
  updatedAt: Date
}

export interface UserCreate {
  name: string
  email: string
  role: (typeof UserRoles)[keyof typeof UserRoles]
  password: string
}

export interface UserUpdate {
  name?: string
  email?: string
  role?: (typeof UserRoles)[keyof typeof UserRoles]
}

export const UserRoles = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const
