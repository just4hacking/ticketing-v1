import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { 
  NotFoundError, 
  requireAuth, 
  validateRequest, 
  BadRequestError,
  OrderStatus
} from '@asatickets/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 1 * 60

const rules = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom(mongoose.Types.ObjectId.isValid)
    .withMessage('TicketId must be provided')
  //we could check a ticket id to be exact the same format
  //as mongodb requires it to be but it creates a little coupling
]

router.post('/api/orders', requireAuth, rules, validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body
  
  //find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId)

  if (!ticket) {
    throw new NotFoundError()
  }

  //make sure that this ticket is not already reserved
  const isReserved = await ticket.isReserved()
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved')
  }

  //calculate an expiration date for this order
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  //build the order and save to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })

  await order.save()
  //publish an event saying that an order was created
  await new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toUTCString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  })

  res.status(201).send(order)
})

export { router as newOrderRouter }