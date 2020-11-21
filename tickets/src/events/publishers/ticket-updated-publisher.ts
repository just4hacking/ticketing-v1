import { 
  Subjects, 
  Publisher, 
  TicketUpdatedEvent
} from '@asatickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}