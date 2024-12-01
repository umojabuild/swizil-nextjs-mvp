import { createClient } from '@supabase/supabase-js'
import { DEMO_CREDENTIALS, DEMO_WIDGETS } from '../demo-account'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || ''

export async function setupDemoAccount() {
  if (!supabaseServiceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_SERVICE_KEY is required')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Create demo user if it doesn't exist
    const { error: signUpError } = await supabase.auth.admin.createUser({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      email_confirm: true,
    })

    if (signUpError && signUpError.message !== 'User already registered') {
      throw signUpError
    }

    // Get the user ID
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', DEMO_CREDENTIALS.email)
      .single()

    if (!userData?.id) {
      throw new Error('Failed to get demo user ID')
    }

    // Set up demo widgets
    const { error: preferencesError } = await supabase
      .from('preferences')
      .upsert({
        user_id: userData.id,
        widget_layout: { widgets: DEMO_WIDGETS },
        updated_at: new Date().toISOString(),
      })

    if (preferencesError) {
      throw preferencesError
    }

    console.log('Demo account setup completed')
  } catch (error) {
    console.error('Error setting up demo account:', error)
    throw error
  }
}