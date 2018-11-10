import 'babel-polyfill'
import config from './config'
import express from 'express'
import Imap from './imap'

let app = express()

app.listen(config.port, () => {
    console.log(`Application is running on port: http://localhost:${config.port}`)
})

new Imap('grupafaf151@gmail.com', 'GRUPAFAF151ABCD').getInbox(1)
         .then(messages => {
           console.log(messages);
         })
