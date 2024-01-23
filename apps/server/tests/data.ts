import { hash } from '@joff/crypto'
import { User } from '../src/modules/user/user.types'

const basicUsers = [
  {
    email: 'narsodev@gmail.com',
    name: 'Narso',
    role: 'ADMIN',
    password: '123456'
  },
  {
    email: 'user@test.com',
    name: 'Test User',
    role: 'USER',
    password: '123456'
  }
] as const

export const usersMock: Array<
  User & {
    rawPassword: string
  }
> = await Promise.all(
  basicUsers.map(async (user, index) => ({
    ...user,
    id: index + 1,
    password: await hash(user.password, 10),
    rawPassword: user.password,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
)

export const adminUserMock = usersMock[0]
export const userMock = usersMock[1]

export const newUserMock = {
  email: 'test@test.com',
  name: 'Test User',
  role: 'USER',
  password: '123456'
} as const
