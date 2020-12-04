import request from 'supertest'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { app } from '../../app'
import { OrderStatus } from '@asatickets/common'

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'token',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = await Order.build({
    status: OrderStatus.Created,
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'token',
      orderId: order.id
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const order = await Order.build({
    status: OrderStatus.Cancelled,
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 20
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'token',
      orderId: order.id
    })
    .expect(400)
})