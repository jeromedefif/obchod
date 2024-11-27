import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uhawlwolmyoqcdurhuel.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoYXdsd29sbXlvcWNkdXJodWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNzgxMDUsImV4cCI6MjA0Nzg1NDEwNX0.2o5fFfo1q3xMKjD7QfFNYcsWb8zv5peWsbFLtnJQF4Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
