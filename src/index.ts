import cors from 'cors'
import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import database from './configs/database'
import env from './configs/env'
import i18n from './configs/i18n'
import { errorHandler } from './middlewares/exceptions/handler'
import { attachResponseHelpers } from './middlewares/response'
import AuthRouter from './routes/auth'
import UserRouter from './routes/user'
import OfferRouter from './routes/offer'
import passport from 'passport'

class Server {
  public app: Application
  private port: number
  private origin: string[]

  constructor() {
    this.app = express()
    this.port = env.PORT
    this.origin = ['http://localhost:3000', env.FRONTEND_URL]
    this.app.use(express.json())
    this.initializeDatabase()
    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeErrorHandler()
  }

  private initializeMiddleware(): void {
    this.app.use(
      cors({
        origin: this.origin,
        credentials: true,
      })
    )
    this.app.use(passport.initialize())

    this.app.use(attachResponseHelpers)
    this.app.use((req, res, next) => {
      i18n.init(req, res)
      const locale = req.get('Accept-Language') || 'en'
      req.setLocale(locale)
      next()
    })
  }

  private initializeRoutes(): void {
    this.app.get('/', async (_: Request, res: Response) => {
      res.success('server.home')
    })
    this.app.use('/api/auth', AuthRouter)
    this.app.use('/api/user', UserRouter)
    this.app.use('/api/offer', OfferRouter)
    this.app.get('*', (_: Request, res: Response) => {
      res.error('server.notFound', {}, 404)
    })
  }

  private initializeErrorHandler(): void {
    this.app.use(errorHandler)
  }

  private initializeDatabase(): void {
    database()
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port} on ${env.NODE_ENV}!`)
    })
  }
}

// Instantiate and start the server
const server = new Server()
server.start()

export default server.app
