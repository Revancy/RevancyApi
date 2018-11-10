import 'babel-polyfill'
import express from 'express'
import Imap from './imap'
import Server from './server'

new Server(express)

new Imap('grupafaf151@gmail.com', 'GRUPAFAF151ABCD').getInboxHeaders(1)
  .then(messages => {
    console.log(messages)
  })
