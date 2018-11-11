import 'babel-polyfill'
import express from 'express'
import Server from './server'

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

new Server(express)
