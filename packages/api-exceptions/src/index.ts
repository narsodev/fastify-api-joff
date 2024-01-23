import { Type } from '@sinclair/typebox'

export { default as ApiException } from './ApiException.js'
export { default as BadRequestException } from './BadRequestException.js'
export { default as ForbiddenException } from './ForbiddenException.js'
export { default as NotFoundException } from './NotFoundException.js'
export { default as UnauthorizedException } from './UnauthorizedException.js'

export const ApiExceptionSchema = Type.Object({
  message: Type.String()
})
