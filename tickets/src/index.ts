import 'express-async-errors'
import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

const start = async () => {
  console.log('Starting...')
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined")
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined")
  }

  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI must be defined")
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined")
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined")
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, 
      process.env.NATS_CLIENT_ID, 
      process.env.NATS_URI
    )

    natsWrapper.client.on('close', () => {
      console.log('NATSconnection closed')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    await new OrderCreatedListener(natsWrapper.client).listen()
    await new OrderCancelledListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }) 
    console.log('Connected to mongodb')
  }
  catch (err) {
    console.log(err)
  }

  const port = 3000
  app.listen(port, () => {
    console.log(`listening on ${port}!`)
  })
}

start()

