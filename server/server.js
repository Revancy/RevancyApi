import config from './config'
import cors from 'cors'
// import cryptojs from 'crypto-js'
import logger from 'morgan'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export default class Server {
  constructor(app) {
    let uri = `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=admin`
    mongoose.connect(uri, config.db.options)

    this.app = app()
    this.router = app.Router()
    if(this.app.get('env') === 'development') var dev = true
    // log if in dev mode
    if(dev) this.app.use(logger('dev'))

    this.app.use(cors())
    this.app.use(app.json())
    this.app.use('/api/v1', this.router)
    this.createBasicRoutes()

    // handle 404
    this.app.use((req, res, next) => {
      let err = new Error('Not found')
      err.status = 404
      next(err)
    })

    // development error handler
    if(dev) {
      this.app.use((err, req, res, next) => {
        console.log('\x1b[31m%s\x1b[0m', err)
        res.status(err.status || 500).send()
      })
    }

    this.app.use((err, req, res, next) => {
      res.status(err.status || 500).send()
    })

    this.start()

    this.users = {}
  }

  start() {
    this.app.listen(config.app.port, () => {
      console.log(`Application is running on port: http://localhost:${config.app.port}/api/v1 in ${this.app.get('env')} mode`)
    })
  }

  createBasicRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hi, this is the Custom Email client')
    })

    this.router.post('/login', (req, res) => {
      console.log(req.body) //used for debugging, delete it in end
      // this is used for decrepting password
      // let bytes = cryptojs.AES.decrypt(req.body.password, 'secret key 123')
      // let decreptedPassword = bytes.toString(cryptojs.enc.Utf8)
      let token = jwt.sign(req.body, 'com.revancy.api')

      this.users[token] = req.body
      res.send({
        token: token
      })
    })
  }
}
