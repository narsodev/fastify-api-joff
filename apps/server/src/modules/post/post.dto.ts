import { Type, Static } from '@sinclair/typebox'

export const PostResponseDTOSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  content: Type.String(),
  authorId: Type.Number()
})

export const PostCreateDTOSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
  authorId: Type.Number()
})

export const PostUpdateDTOSchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.String())
})

export type PostResponseDTO = Static<typeof PostResponseDTOSchema>

export type PostCreateDTO = Static<typeof PostCreateDTOSchema>

export type PostUpdateDTO = Static<typeof PostUpdateDTOSchema>
