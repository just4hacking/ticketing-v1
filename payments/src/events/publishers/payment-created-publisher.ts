import {
  Publisher,
  Subjects,
  PaymentCreatedEvent
} from '@asatickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}