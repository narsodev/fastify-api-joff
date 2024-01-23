import { ForbiddenException } from '@joff/api-exceptions'

import { User, UserRoles } from './user.types.js'

export const requireAdmin = (user: User): void => {
  if (user.role !== UserRoles.ADMIN) {
    throw new ForbiddenException()
  }
}

export const requireSelfOrAdmin = (user: User, id: User['id']): void => {
  if (user.role !== UserRoles.ADMIN && user.id !== id) {
    throw new ForbiddenException()
  }
}
