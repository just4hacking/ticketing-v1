import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { OrderStatus, PaymentCreatedEvent } from '@asatickets/common'
import { PaymentCreatedListener } from '../payment-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'

const setup = async () => {
  //create and instance of the listener
  const listener = new PaymentCreatedListener(natsWrapper.client)

  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save()
  
  const order = await Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: mongoose.Types.ObjectId().toHexString(),
    ticket
  })
  await order.save()

  //create a fake data event
  const data: PaymentCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
    stripeId: 'stripeId'
  }

  //create a fake message ovject
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    msg,
    data,
    listener,
    order
  }
}

it('updates the order status', async() => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.orderId)

  expect(order).not.toBeNull()
  expect(order!.status).toEqual(OrderStatus.Complete)
})

it('acks the event', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})