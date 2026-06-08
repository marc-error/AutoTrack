import { initializeApp, cert, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import logger from '../utils/logger.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

let app = null
let db = null
let adminAuth = null

try {
  const serviceAccountPath = join(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'serviceAccountKey.json')

  if (existsSync(serviceAccountPath)) {
    app = initializeApp({ credential: cert(serviceAccountPath) })
    logger.info('Firebase Admin initialized with service account file')
  } else {
    app = initializeApp({ credential: applicationDefault() })
    logger.info('Firebase Admin initialized with default credentials')
  }

  db = getFirestore(app)
  adminAuth = getAuth(app)
} catch (error) {
  logger.error('Firebase Admin initialization failed', { error: error.message })
  process.exit(1)
}

export { app, db, adminAuth }
