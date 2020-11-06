import { CustomError } from './custom-error'

const defaultMessage = 'Error connecting to database'

export class DatabaseConnectionError extends Error {
  statusCode = 500
  reason = defaultMessage

  constructor() {
    super(defaultMessage)
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}