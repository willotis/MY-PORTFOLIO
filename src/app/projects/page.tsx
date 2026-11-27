import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectsGallery from '@/components/projects/ProjectsGallery'
import { createClient } from '@/lib/supabase/server'
import { fetchLatestProfile } from '@/lib/supabase/profile'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { DEFAULT_PROJECTS, DEFAULT_PROFILE } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my software engineering, digital safety, and appointment booking projects.',
}

export default async function ProjectsPage() {
  let projects = DEFAULT_PROJECTS
  let profile = DEFAULT_PROFILE

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const [pRes, projRes] = await Promise.all([
        fetchLatestProfile(supabase),
        supabase.from('projects').select('*').eq('published', true).order('sort_order'),
      ])
      if (pRes.data) profile = pRes.data
      if (projRes.data && projRes.data.length > 0) projects = projRes.data
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#0d1017] text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="hero-navy-backdrop py-12 sm:py-16 border-b border-white/[0.06]">
          <div className="page-container">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-[#3b82f6] uppercase mb-3">
                Portfolio
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                Selected Projects &amp; Prototypes
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Case studies covering privacy-first incident documentation, appointment reservation engines, and modern full-stack web applications.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Gallery */}
        <section className="py-12 sm:py-16">
          <div className="page-container">
            <ProjectsGallery projects={projects} />
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
