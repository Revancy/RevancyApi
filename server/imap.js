import imap from 'imap'
import util from 'util'
import mailParser from 'mailparser'

export default class Imap {
  constructor(user, password, host = 'imap.gmail.com') {
    this.simpleParser = mailParser.simpleParser

    this.imap = new imap({
      user: user,
      password: password,
      host: host,
      port: 993,
      tls: true
    })

    this.imap.connect()

    this.imap.once('ready', () => {
      console.log('Imap Connection Ready')
      this.imapRequest()})

    this.imap.once('error', (err) => {
      console.log(err)
    })

    this.imap.once('end', () => {
      console.log('Imap Connection ended')
    })
  }

  getInbox(page) {
    return new Promise((resolve, reject) => {
      this.imapRequest = () => {
        let mailsParsers = []
        let inspect = util.inspect
        this.imap.openBox('INBOX', true, (err, box) => {
          if (err) throw err
          let start = box.messages.total - 1 * 10
          var f = this.imap.seq.fetch(start + ':' + (start * 10) , {
            bodies: 'HEADER.FIELDS (TO FROM SUBJECT DATE)'
          })
          f.on('message', (msg, seqno) => {
            console.log('Message #%d', seqno)
            var prefix = '(#' + seqno + ') '
            msg.on('body', (stream, info) => {
              mailsParsers.push(this.simpleParser(stream))
            })
            msg.once('attributes', (attrs) => {
              //console.log(attrs)
            })
            msg.once('end', () => {
              console.log(prefix + 'Finished')
            })
          })
          f.once('error', (err) => {
            console.log('Fetch error: ' + err)
          })
          f.once('end', () => {
            console.log('Done fetching all messages!')
            Promise.all(mailsParsers).then(mails => {
              console.log('******* All parsed ********');
              resolve(mails)
            })
            this.imap.end()
          })
        })
      }
    })
  }
}
