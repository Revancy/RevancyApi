import dotenv from 'dotenv'
dotenv.config()

const config = {
  app: {
    port: process.env.APP_PORT || 8000
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'test',
    options: {
      useNewUrlParser: true,
      keepAlive: 120
    }
  }
}

export default config
