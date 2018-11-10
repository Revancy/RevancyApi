import config from './config'
import cors from 'cors'
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
    this.app.listen(config.port, () => {
        console.log(`Application is running on port: http://localhost:${config.port}`)
    })
  }

  createBasicRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hi, this is the Custom Email client')
    })

    this.router.post('/login', (req, res) => {
      let token = jwt.sign(req.body, 'com.revancy.api')
      this.users[token] = req.body
      res.send({
        token: token
      })
    })
  }
}
