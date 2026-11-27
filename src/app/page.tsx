import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import SkillsPreview from '@/components/home/SkillsPreview'
import ContactCTA from '@/components/home/ContactCTA'
import { createClient } from '@/lib/supabase/server'
import { fetchLatestProfile } from '@/lib/supabase/profile'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '@/lib/constants'

// Always fetch fresh data from Supabase — never serve a cached page
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  let profile = DEFAULT_PROFILE
  let projects = DEFAULT_PROJECTS
  let skills: { id: string; category: string; name: string }[] = []

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const [profileRes, projectsRes, skillsRes] = await Promise.all([
        fetchLatestProfile(supabase),
        supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .eq('published', true)
          .order('sort_order'),
        supabase.from('skills').select('*').order('sort_order'),
      ])
      if (profileRes.data) profile = profileRes.data
      if (projectsRes.data?.length) projects = projectsRes.data
      if (skillsRes.data?.length) skills = skillsRes.data
    } catch {
      // Graceful fallback
    }
  }

  const isAvailable = Boolean(
    profile?.availability_employment ||
      profile?.availability_freelance ||
      profile?.availability_collaboration
  )

  return (
    <div className="min-h-screen bg-[#0d1017] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection
          portraitUrl={profile?.avatar_url || '/images/portrait.png'}
          name={profile?.name || 'Willis Otis'}
          title={profile?.title || 'Software Developer & Tech Professional'}
          headline={profile?.tagline || 'Building technology that solves real problems.'}
          tagline="Software Development · Data Analysis · AI Automation"
          bio={
            profile?.bio ||
            'I design and build dependable digital products — spanning full-stack web engineering, data analysis, and practical AI workflow automation.'
          }
          cvVisible={profile?.cv_visible !== false}
          available={isAvailable}
        />
        <FeaturedProjects projects={projects} />
        <SkillsPreview skills={skills} />
        <ContactCTA
          email={profile?.email || 'hello@willisotis.dev'}
          availability={{
            employment: profile?.availability_employment ?? true,
            freelance: profile?.availability_freelance ?? true,
            collaboration: profile?.availability_collaboration ?? true,
          }}
        />
      </main>
      <Footer
        name={profile?.name || 'Willis Otis'}
        email={profile?.email || 'hello@willisotis.dev'}
        github={profile?.github_url || 'https://github.com'}
        linkedin={profile?.linkedin_url || 'https://linkedin.com'}
        twitter={profile?.twitter_url || 'https://twitter.com'}
      />
    </div>
  )
}
