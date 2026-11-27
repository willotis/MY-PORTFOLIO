import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchLatestProfile } from '@/lib/supabase/profile'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient()
      const { data: profile } = await fetchLatestProfile(supabase)

      if (profile && !profile.cv_visible) {
        return NextResponse.json({ error: 'CV is currently private' }, { status: 404 })
      }

      if (profile?.cv_url) {
        if (profile.cv_url.startsWith('/')) {
          return NextResponse.redirect(new URL(profile.cv_url, request.url))
        }
        try {
          const parsed = new URL(profile.cv_url)
          if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
            return NextResponse.redirect(parsed.toString())
          }
        } catch {
          // Fall through to local CV fallback if stored URL is invalid
        }
      }
    }

    // Fallback to starter CV PDF when no custom CV is uploaded yet
    const fallbackPath = path.join(process.cwd(), 'public', 'Willis-Otis-CV.pdf')
    const fileBuffer = await readFile(fallbackPath)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Willis-Otis-CV.pdf"',
      },
    })
  } catch {
    return NextResponse.redirect(new URL('/Willis-Otis-CV.pdf', request.url))
  }
}
