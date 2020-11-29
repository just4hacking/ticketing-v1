import { Message } from 'node-nats-streaming'
import {
  Subjects,
  Listener,
  TicketUpdatedEvent
} from '@asatickets/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  readonly queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, id, version } = data
    
    const ticket = await Ticket.findOne({
      _id: id,
      version: version - 1
    })

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}