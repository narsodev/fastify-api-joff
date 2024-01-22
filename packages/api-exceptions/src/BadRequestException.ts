import ApiException from './ApiException.js'

export default class BadRequestException extends ApiException {
  constructor(message = 'Bad Request') {
    super(400, message)
    this.name = 'BadRequestException'
  }
}
