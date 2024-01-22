export class AuthFailedException extends Error {
  constructor() {
    super('Authentication failed. Invalid email or password.')
  }
}
