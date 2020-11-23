import {
  Publisher,
  OrderCancelledEvent,
  Subjects
} from '@asatickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}