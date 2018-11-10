import 'babel-polyfill'
import config from './config'
import express from 'express'

let app = express()

app.listen(config.port, () => {
    console.log(`Application is running on port: http://localhost:${config.port}`)
})
