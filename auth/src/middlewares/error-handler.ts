import { Response, Request, NextFunction } from 'express'
import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map(error => {
      return { message: error.msg, field: error.param }
    })
    res.status(400).send({ errors: formattedErrors })
  }

  if (err instanceof DatabaseConnectionError) {
    const formattedErrors = [{ message: err.reason }]
    res.status(500).send({ errors: formattedErrors })
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }]
  })
}