import ApiException from './ApiException.js'

export default class ForbiddenException extends ApiException {
  constructor(message = 'Forbidden') {
    super(403, message)
    this.name = 'ForbiddenException'
  }
}
