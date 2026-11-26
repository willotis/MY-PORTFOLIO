import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
    }

    const { name, email, subject, message } = body

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const safeSubject = typeof subject === 'string' ? subject.trim().slice(0, 300) : ''

    if (isSupabaseConfigured()) {
      const supabase = await createClient()
      const { error } = await supabase.from('messages').insert({
        name: name.trim().slice(0, 200),
        email: email.trim().slice(0, 200),
        subject: safeSubject,
        message: message.trim().slice(0, 5000),
      })
      if (error) throw error
    } else {
      console.log('Inquiry received (local fallback):', { name, email, subject, message })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form submission error:', err)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
