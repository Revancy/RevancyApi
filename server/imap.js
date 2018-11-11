import imap from 'imap'
import mailParser from 'mailparser'

const FETCH = {
  headers: 'HEADER.FIELDS (TO FROM SUBJECT DATE)',
  messages: 'TEXT'
}

export default class Imap {
  constructor(user, password, host = 'imap.gmail.com') {

    this.simpleParser = mailParser.simpleParser

    this.mailsParsers = []
    this.imap = new imap({
      user: user,
      password: password,
      host: host,
      port: 993,
      tls: true
    })

    this.imap.once('error', (err) => {
      console.log(err)
    })

    this.imap.once('end', () => {
      console.log('Imap Connection ended')
    })
  }

  connect() {
    this.imap.connect()
    return new Promise(resolve => {
      this.imap.once('ready', () => {
        console.log('Imap Connection Ready')
        resolve(this)
      })
    })
  }

  getInboxData(page, type) {
    this.imap.openBox('INBOX', true, (err, box) => {
      if (err) throw err
      const perPage = 50
      let start = box.messages.total - (page  * perPage)
      this.inboxFetch = this.imap.seq.fetch(start + ':' + (start + perPage) , {
        bodies: type
      })

      this.inboxFetch.on('message', this.onFetchMessage.bind(this))

      this.inboxFetch.once('error', this.onError.bind(this))

      this.inboxFetch.once('end', this.onFetchEnd.bind(this))

    })
  }

  onFetchMessage(msg, seqno) {
    let stream = null
    let attributes = null
    msg.on('body', streamData => {
      stream = streamData
    })
    msg.once('attributes', (attrs) => {
      attributes = attrs
    })
    msg.once('end', () => {
      this.mailsParsers.push(new Promise(resolve =>
        this.simpleParser(stream).then(mail => {
          mail.id = seqno
          mail.attributes = attributes
          resolve(mail)
        })))
    })
  }

  onFetchEnd() {
    Promise.all(this.mailsParsers).then(mails => {
      this.resolveFetch(mails)
    })
  }

  onError(error) {
    console.log('Imap error: ' + error)
  }

  getInboxHeaders(page) {
    this.getInboxData(page, FETCH.headers)
    return new Promise(resolve => {
      this.resolveFetch = (mails) => {
        resolve(mails)
      }
    })
  }


}
