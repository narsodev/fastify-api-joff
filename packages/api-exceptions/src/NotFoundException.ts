import ApiException from './ApiException.js'

export default class NotFoundException extends ApiException {
  constructor(message = 'Not Found') {
    super(404, message)
    this.name = 'NotFoundException'
  }
}
