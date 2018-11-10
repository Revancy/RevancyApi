import mongoose from 'mongoose'

let messageHeaderSchema = new mongoose.Schema({
  senderName: { type: String, trim: true },
  title: { type: String, trim: true },
  date: { type: Date, default: Date.now }
},
{
  toObject: { getters: true }
})

let MessageHeader = mongoose.model('MessageHeader', messageHeaderSchema)

export default MessageHeader
