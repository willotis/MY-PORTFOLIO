import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MediaGallery from '@/components/media/MediaGallery'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { DEFAULT_PROFILE } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Media',
  description: 'Visual gallery of software demonstrations, project walkthroughs, and system captures.',
}

export default async function MediaPage() {
  let media: Parameters<typeof MediaGallery>[0]['media'] = []
  let profile = DEFAULT_PROFILE

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const [mediaRes, profRes] = await Promise.all([
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').single(),
      ])
      if (mediaRes.data) media = mediaRes.data
      if (profRes.data) profile = profRes.data
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#0d1017] text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="hero-navy-backdrop py-12 sm:py-16 border-b border-white/[0.06]">
          <div className="page-container">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-[#3b82f6] uppercase mb-3">
                Visual Documentation
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                Media &amp; Demonstrations
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Interface walkthroughs, system architectures, and visual snapshots documenting project development.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-12 sm:py-16">
          <div className="page-container">
            <MediaGallery media={media} />
          </div>
        </section>
      </main>

      <Footer
        name={profile.name}
        email={profile.email}
        github={profile.github_url}
        linkedin={profile.linkedin_url}
        twitter={profile.twitter_url}
      />
    </div>
  )
}
