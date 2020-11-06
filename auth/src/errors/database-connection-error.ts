import { CustomError } from './custom-error'

const defaultReason = 'Error connecting to database'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = defaultReason

  constructor() {
    super(defaultReason)

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}