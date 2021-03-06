import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('has a route handler listening to /api/tickets for post requests', async() => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if user is signed in', async() => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('returns a status other than 401 if user is signed in', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({})
    
  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async() => {
  const cookie = global.signin()

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    })
    .expect(400)  
})

it('returns an error if an invalid price is provided', async() => {
  const cookie = global.signin()

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'goodtitle',
      price: -10
    })
    .expect(400)
})

it('creates a ticket with valid inputs', async() => {
  //add in a check to make sure a ticket was saved
  const cookie = global.signin()

  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'goodtitle',
      price: 10
    })
    .expect(201)
  
  tickets = await Ticket.find({})

  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(10)
  expect(tickets[0].title).toEqual('goodtitle')
})

it('publishes an event', async () => {
  //add in a check to make sure a ticket was saved
  const cookie = global.signin()

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'goodtitle',
      price: 10
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
