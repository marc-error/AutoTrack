import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:5174']

app.use(helmet())

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: { error: 'Too many requests, please try again later' }
})
app.use(limiter)

app.use(express.json({ limit: '10kb' }))

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`)
  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
  setTimeout(() => {
    console.error('Forced shutdown after timeout.')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
