import request from 'supertest'
import { app } from '../../app'

it('awaits a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
})

it('awaits a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalid email',
      password: 'password'
    })
    .expect(400)
})

it('awaits a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pas'
    })
    .expect(400)
})


it('awaits a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
})

it('disallows duplicate emails', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass'
    })
    .expect(400)
})

it('it sets a cookie after successfull signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass'
    })
    .expect(201)

  expect(response.get("Set-Cookie")).toBeDefined()
})