import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { requestIdMiddleware } from './middleware/requestId.js'
import logger from './utils/logger.js'

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:5174']

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://*.firebaseio.com', 'https://*.googleapis.com']
    }
  }
}))

app.use(cors({
  origin: allowedOrigins,
  credentials: false
}))

app.use(requestIdMiddleware)

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
})
app.use(limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later' }
})

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests for this operation' }
})

app.use(express.json({ limit: '10kb' }))

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  logger.info('Server started', { port: PORT })
})

const shutdown = (signal) => {
  logger.info('Shutdown initiated', { signal })
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
