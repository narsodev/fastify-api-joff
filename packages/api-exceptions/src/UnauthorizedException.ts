import ApiException from './ApiException.js'

export default class UnauthorizedException extends ApiException {
  constructor(message = 'Unauthorized') {
    super(401, message)
    this.name = 'UnauthorizedException'
  }
}
