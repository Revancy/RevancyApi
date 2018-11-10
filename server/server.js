import config from './config'
import cors from 'cors'
// import cryptojs from 'crypto-js'
import jwt from 'jsonwebtoken'

export default class Server {
  constructor(app) {
    this.app = app()
    this.router = app.Router()
    this.app.use(cors())
    this.app.use(app.json())
    this.createBasicRoutes()
    this.app.use('/api/v1', this.router)
    this.start()

    this.users = {}
  }

  start() {
    this.app.listen(config.app.port, () => {
      console.log(`Application is running on port: http://localhost:${config.app.port}/api/v1`)
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
