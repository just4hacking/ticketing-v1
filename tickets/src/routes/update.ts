import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@asatickets/common'
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

router.put('/api/tickets/:id', requireAuth, rules, validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    throw new NotFoundError()
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  const { title, price } = req.body

  ticket.set({
    title,
    price
  })
  await ticket.save()
  
  res.status(200).send(ticket)
})

export { router as updateTicketRouter }