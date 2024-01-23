import { describe, it, beforeEach, expect } from 'vitest'

import UserService from '../../src/modules/user/user.service.js'
import UserDummyRepository from '../dummies/user.dummy-repository.js'
import FileDummyRepository from '../dummies/file.dummy-repository.js'
import { adminUserMock, newUserMock, userMock, usersMock } from '../data.js'
import { User } from '../../src/modules/user/user.types.js'
import { compareWithHash } from '@joff/crypto'

describe('UserService', () => {
  let userService: UserService
  let userRepository: UserDummyRepository

  beforeEach(async () => {
    userRepository = new UserDummyRepository(usersMock)

    userService = new UserService(userRepository, new FileDummyRepository())
  })

  it('should get all users', async () => {
    const users = await userService.getAll()
    expect(users.length).toBe(usersMock.length)
  })

  it('should create an user', async () => {
    const lengthBefore = userRepository.users.length

    await userService.create({
      data: newUserMock,
      loggedUser: adminUserMock
    })

    const lengthAfter = userRepository.users.length

    expect(lengthAfter).toBe(lengthBefore + 1)
  })

  it('should hash the password when creating an user', async () => {
    const user = await userService.create({
      data: newUserMock,
      loggedUser: adminUserMock
    })

    const userData = (await userRepository.getById(user.id)) as User
    expect(userData.password).not.toBe(newUserMock.password)

    const passwordMatches = await compareWithHash(
      newUserMock.password,
      userData.password
    )
    expect(passwordMatches).toBe(true)
  })
})
