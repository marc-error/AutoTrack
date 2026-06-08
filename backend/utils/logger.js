import { randomUUID } from 'crypto'

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
}

const formatLog = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  }
  return JSON.stringify(entry)
}

const logger = {
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, meta))
    }
  },

  info: (message, meta = {}) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, meta))
  },

  warn: (message, meta = {}) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, meta))
  },

  error: (message, meta = {}) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, meta))
  }
}

export const createRequestId = () => randomUUID()

export default logger
