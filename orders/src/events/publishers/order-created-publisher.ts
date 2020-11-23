import {
  Publisher,
  OrderCreatedEvent,
  Subjects
} from '@asatickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}