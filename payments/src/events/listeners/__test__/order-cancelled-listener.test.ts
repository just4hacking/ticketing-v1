import mongoose from 'mongoose'
import { OrderCancelledEvent, OrderStatus } from '@asatickets/common'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'ID',
    version: 0
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'id'
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener,
    data,
    msg,
    order
  }
}

it('sets the order status to cancelled', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.status).toEqual(OrderStatus.Cancelled)
  expect(order!.id).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})