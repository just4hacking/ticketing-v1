import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next()
  }

  try {
    const paylod  = jwt.verify(
      req.session.jwt, 
      process.env.JWT_KEY!
    ) as UserPayload
    req.currentUser = paylod
  }
  catch (exc) {

  }

  next()
}