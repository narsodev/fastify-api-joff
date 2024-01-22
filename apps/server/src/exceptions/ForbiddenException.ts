import ApiException from './ApiException.js'

export default class ForbiddenException extends ApiException {
  constructor() {
    super(403, 'Forbidden')
  }
}
