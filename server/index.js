import 'babel-polyfill'
import express from 'express'
import Server from './server'

let server = new Server(express)
