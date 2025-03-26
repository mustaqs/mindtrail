// Supabase configuration for Mindtrail early access
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase configuration
// Hard-coded for browser use (these will be in .env for server-side code)
const supabaseUrl = 'https://vwvolbwgkrswilswvdnj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dm9sYndna3Jzd2lsc3d2ZG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDA1ODAsImV4cCI6MjA1ODU3NjU4MH0.fSNmIR4vcXIP3Z7c97HQrOyLmu5nhmYVQpNlwOmqe-4'

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
