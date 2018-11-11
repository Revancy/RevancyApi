import Message from '../models/message'

export default class MessageMapper {

  toMessage(imapMessages) {
    let messages = []
    imapMessages.forEach(item => {
      let data = {
        id: item.id,
        fromName: item.from.value[0].name,
        fromMail: item.from.value[0].address,
        subject: item.subject,
        date: item.date,
        read: item.attributes.flags.length === 0 ? false : true,
        color: { type: String, default: '#ffa500' },
        content: { type: String, default: 'TestEmptyMessage' }
      }

      messages.push(new Message(data))
    })

    return messages
  }
}
