export default class ApiException extends Error {
  readonly code: number

  constructor(code = 500, message = 'Internal Server Error') {
    super(message)
    this.code = code
    this.name = 'ApiException'
  }
}
