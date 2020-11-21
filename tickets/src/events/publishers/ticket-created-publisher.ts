import { 
  Subjects, 
  Publisher, 
  TicketCreatedEvent 
} from '@asatickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}