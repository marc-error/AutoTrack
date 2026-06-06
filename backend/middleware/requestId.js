import { createRequestId } from '../utils/logger.js'

export const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || createRequestId()
  req.id = requestId
  res.setHeader('X-Request-ID', requestId)
  next()
}
