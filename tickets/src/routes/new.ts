import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@asatickets/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

const rules = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than zero')
]

router.post('/api/tickets', requireAuth, rules, validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body

  const ticket = Ticket.build({ 
    title, 
    price, 
    userId: req.currentUser!.id
  })

  await ticket.save()
  
  res.status(201).send(ticket)
})

export { router as createTicketRouter }