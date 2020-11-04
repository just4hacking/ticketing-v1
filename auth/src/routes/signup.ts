import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

const rules = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Must be between 4 and 20 charcters')   
]

router.post('/api/users/signup', rules, (req: Request, res: Response) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array())
  }

  const { email, password } = req.body
  console.log('Creating user')
  res.send({})
})

export { router as signupRouter }