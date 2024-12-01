import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { DEMO_CREDENTIALS } from '../src/lib/demo-account'
import { createDatabaseClient } from '../src/lib/supabase/database'

config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  try {
    const client = await createDatabaseClient()
    console.log('Connected to database, running migrations...')
    
    const initialSchema = readFileSync(
      resolve(__dirname, '../supabase/migrations/20240220000000_initial_schema.sql'),
      'utf8'
    )
    console.log('Executing initial schema migration...')
    await client.query(initialSchema)
    
    const createDemoUser = readFileSync(
      resolve(__dirname, '../supabase/migrations/20240220000001_create_demo_user.sql'),
      'utf8'
    )
    console.log('Creating demo user...')
    await client.query(createDemoUser)

    console.log('✓ Database migrations completed')
    return true
  } catch (error) {
    console.error('Error running migrations:', error instanceof Error ? error.message : error)
    return false
  } finally {
    try {
      await client?.end()
    } catch (error) {
      console.error('Error closing database connection:', error)
    }
  }
}

async function setupAuth() {
  try {
    console.log('Setting up authentication...')
    
    const { error: signUpError } = await supabase.auth.admin.createUser({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      email_confirm: true,
    })

    if (signUpError && signUpError.message !== 'User already registered') {
      throw signUpError
    }

    console.log('✓ Auth setup completed')
    return true
  } catch (error) {
    console.error('Error setting up auth:', error)
    return false
  }
}

async function main() {
  try {
    console.log('Starting setup...')

    const migrationsSuccess = await runMigrations()
    if (!migrationsSuccess) {
      throw new Error('Migrations failed')
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for migrations to settle
    
    const authSuccess = await setupAuth()
    if (!authSuccess) {
      throw new Error('Auth setup failed')
    }
    
    console.log('✓ Setup completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Setup failed:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})