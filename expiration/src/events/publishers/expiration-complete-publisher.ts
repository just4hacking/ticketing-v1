import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@asatickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}

