import { Type } from '@sinclair/typebox'

export const UserTokenSchema = Type.Object({
  id: Type.Number(),
  email: Type.String(),
  name: Type.String()
})
