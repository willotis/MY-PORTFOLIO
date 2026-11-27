import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { DEFAULT_PROFILE } from '@/lib/constants'
import { Briefcase, GraduationCap, Award, Code2, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about my technical background, engineering methodology, and professional experience.',
}

export default async function AboutPage() {
  let profile = DEFAULT_PROFILE
  let skills = [
    { id: '1',  category: 'Software Development', name: 'TypeScript' },
    { id: '2',  category: 'Software Development', name: 'JavaScript (ESNext)' },
    { id: '3',  category: 'Software Development', name: 'Python' },
    { id: '4',  category: 'Software Development', name: 'React & Next.js' },
    { id: '5',  category: 'Software Development', name: 'Node.js' },
    { id: '6',  category: 'Software Development', name: 'SQL & PostgreSQL' },
    { id: '7',  category: 'Data Analysis',        name: 'Statistical Modeling' },
    { id: '8',  category: 'Data Analysis',        name: 'Data Visualization' },
    { id: '9',  category: 'Data Analysis',        name: 'Python (Pandas / NumPy)' },
    { id: '10', category: 'Data Analysis',        name: 'Power BI & Dashboards' },
    { id: '11', category: 'AI Automation',        name: 'Prompt Architecture' },
    { id: '12', category: 'AI Automation',        name: 'Agentic Workflows' },
    { id: '13', category: 'AI Automation',        name: 'API Integrations' },
    { id: '14', category: 'Tools & Platforms',    name: 'Git & GitHub' },
    { id: '15', category: 'Tools & Platforms',    name: 'Supabase' },
    { id: '16', category: 'Tools & Platforms',    name: 'Tailwind CSS' },
  ]
  let experience = [
    {
      id: '1',
      title: 'Full-Stack Developer & Tech Consultant',
      company: 'Independent / Technical Projects',
      start_date: '2023',
      end_date: 'Present',
      description: 'Architecting scalable web applications, automated workflows, and data pipelines for diverse digital initiatives. Focus areas include privacy-preserving technology, booking systems, and AI-assisted workflows.',
    },
    {
      id: '2',
      title: 'Software Developer',
      company: 'Technology Solutions',
      start_date: '2021',
      end_date: '2023',
      description: 'Engineered responsive web applications, built secure RESTful services, and automated data processing tasks.',
    },
  ]
  let education = [
    {
      id: '1',
      institution: 'University / Institute of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science / Information Technology',
      start_year: '2018',
      end_year: '2022',
    },
  ]
  let certifications = [
    { id: '1', name: 'Full-Stack Engineering Certification', issuer: 'Professional Tech Academy', year: '2023' },
    { id: '2', name: 'Data Analysis & Visualization', issuer: 'Specialized Institute', year: '2022' },
    { id: '3', name: 'AI & Automation Specialist', issuer: 'Online Credentials', year: '2024' },
  ]

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const [pRes, sRes, expRes, eduRes, certRes] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('skills').select('*').order('category').order('sort_order'),
        supabase.from('experience').select('*').order('sort_order'),
        supabase.from('education').select('*').order('sort_order'),
        supabase.from('certifications').select('*').order('sort_order'),
      ])
      if (pRes.data) profile = pRes.data
      if (sRes.data?.length) skills = sRes.data
      if (expRes.data?.length) experience = expRes.data
      if (eduRes.data?.length) education = eduRes.data
      if (certRes.data?.length) certifications = certRes.data
    } catch {}
  }

  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0d1017] text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="hero-navy-backdrop py-12 sm:py-16 border-b border-white/[0.06]">
          <div className="page-container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-wider text-[#3b82f6] uppercase mb-3">
                About Me
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                {profile.name}
              </h1>
              <p className="text-lg text-blue-300 font-medium mb-5">
                {profile.title}
              </p>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {profile.bio}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/contact" className="cta-button-primary text-sm">
                  <span>Let&apos;s Connect</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <a href="/api/cv/download" download className="cta-button-secondary text-sm">
                  Download CV
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="py-12 sm:py-16 border-b border-white/[0.06]">
          <div className="page-container">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Code2 size={18} aria-hidden="true" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Technical Stack &amp; Skills
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(skillGroups).map(([category, items]) => (
                <div key={category} className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-4">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span key={item.id} className="tech-tag">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="py-12 sm:py-16 border-b border-white/[0.06]">
            <div className="page-container">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Briefcase size={18} aria-hidden="true" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Work Experience
                </h2>
              </div>

              <div className="space-y-5 max-w-4xl">
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {exp.title}
                        </h3>
                        <p className="text-sm font-medium text-blue-400 mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-slate-300 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                        {exp.start_date} — {exp.end_date}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-slate-300 leading-relaxed mt-3">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {(education.length > 0 || certifications.length > 0) && (
          <section className="py-12 sm:py-16">
            <div className="page-container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {education.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <GraduationCap size={18} aria-hidden="true" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        Education
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="bg-[#141822] border border-white/[0.08] rounded-2xl p-5">
                          <h3 className="font-bold text-white text-base">
                            {edu.institution}
                          </h3>
                          <p className="text-sm text-blue-400 mt-0.5">
                            {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                          </p>
                          {(edu.start_year || edu.end_year) && (
                            <p className="text-xs text-slate-400 mt-2">
                              {edu.start_year}{edu.end_year ? ` - ${edu.end_year}` : ''}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {certifications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Award size={18} aria-hidden="true" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        Certifications
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="bg-[#141822] border border-white/[0.08] rounded-2xl p-5">
                          <h3 className="font-bold text-white text-sm">
                            {cert.name}
                          </h3>
                          <p className="text-xs text-blue-400 mt-0.5 font-medium">
                            {cert.issuer}
                          </p>
                          {cert.year && (
                            <p className="text-xs text-slate-400 mt-1">
                              {cert.year}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
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
