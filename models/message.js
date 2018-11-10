import mongoose from 'mongoose'

let messageSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  fromName: { type: String, trim: true },
  fromMail: { type: String, trim: true },
  subject: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  color: { type: String, default: '#ffa500' },
  content: { type: String, default: 'TestEmptyMessage' }
},
{
  toObject: { getters: true }
})

let Message = mongoose.model('Message', messageSchema)

export default Message
