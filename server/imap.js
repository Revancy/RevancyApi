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
    return Promise(resolve => {
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
    console.log('Message #%d', seqno)
    var prefix = '(#' + seqno + ') '
    msg.on('body', stream => {
      this.mailsParsers.push(this.simpleParser(stream))
    })
    msg.once('end', () => {
      console.log(prefix + 'Finished')
    })
  }

  onFetchEnd() {
    Promise.all(this.mailsParsers).then(mails => {
      console.log('******* All parsed ********')
      this.resolveFetch(mails)
    })
    this.imap.end()
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
