import { Type, type Static } from '@sinclair/typebox'

export const UserResponseDTOSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String()
})

export const UserCreateDTOSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  password: Type.String()
})

export const UserUpdateDTOSchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String())
})

export type UserResponseDTO = Static<typeof UserResponseDTOSchema>

export type UserCreateDTO = Static<typeof UserCreateDTOSchema>

export type UserUpdateDTO = Static<typeof UserUpdateDTOSchema>
