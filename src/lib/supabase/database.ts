import { Client } from 'pg'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../../../.env') })

const { DATABASE_URL } = process.env

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export const createDatabaseClient = async () => {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('Successfully connected to database')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }

  return client
}