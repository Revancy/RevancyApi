import 'babel-polyfill'
import express from 'express'
import Imap from './imap'
import Server from './server'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

new Server(express)

new Imap('grupafaf151@gmail.com', 'GRUPAFAF151ABCD').getInbox(1)
  .then(messages => {
    console.log(messages)
  })
