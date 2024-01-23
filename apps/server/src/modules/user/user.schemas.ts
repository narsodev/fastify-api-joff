import { Type, type Static } from '@sinclair/typebox'

import { UserRoles } from './user.types.js'

export const UserResponseDTOSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String()
})

export const UserCreateDTOSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  role: Type.Union([
    Type.Literal(UserRoles.ADMIN),
    Type.Literal(UserRoles.USER)
  ])
})

export const UserUpdateDTOSchema = Type.Object({
  name: Type.Optional(Type.String())
})

export type UserResponseDTO = Static<typeof UserResponseDTOSchema>

export type UserCreateDTO = Static<typeof UserCreateDTOSchema>

export type UserUpdateDTO = Static<typeof UserUpdateDTOSchema>
