import ForbiddenException from '../../exceptions/ForbiddenException.js'
import { User, UserRoles } from './user.entity.js'

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
