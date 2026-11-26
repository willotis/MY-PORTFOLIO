import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { DEFAULT_PROJECTS, DEFAULT_PROFILE } from '@/lib/constants'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/icons/BrandIcons'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let project = null
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.from('projects').select('title, description').eq('slug', slug).single()
      project = data
    } catch {}
  }
  if (!project) project = DEFAULT_PROJECTS.find((p) => p.slug === slug)
  if (!project) return { title: 'Project Not Found' }
  return { title: project.title, description: project.description }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  let project = null
  let profile = DEFAULT_PROFILE

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const [projRes, profRes] = await Promise.all([
        supabase.from('projects').select('*').eq('slug', slug).eq('published', true).single(),
        supabase.from('profiles').select('*').single(),
      ])
      if (projRes.data) project = projRes.data
      if (profRes.data) profile = profRes.data
    } catch {}
  }

  if (!project) project = DEFAULT_PROJECTS.find((p) => p.slug === slug)
  if (!project) notFound()

  const caseStudySections = [
    { title: 'The Problem Context', content: project.problem, step: '01' },
    { title: 'Technical Architecture & Solution', content: project.solution, step: '02' },
    { title: 'My Role & Key Contributions', content: project.role, step: '03' },
    { title: 'Development Journey & Milestones', content: project.journey, step: '04' },
  ]

  return (
    <div className="min-h-screen bg-[#0d1017] text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Case Study Header */}
        <section className="hero-navy-backdrop py-10 sm:py-14 border-b border-white/[0.06]">
          <div className="page-container">
            <div className="max-w-4xl">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
                <span>Back to All Projects</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/15 border border-blue-500/25 text-blue-300 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                  {project.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                {project.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-7">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button-primary text-sm"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    <span>Live Prototype</span>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button-secondary text-sm"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>View Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Body */}
        <div className="page-container py-10 sm:py-14">
          <div className="max-w-4xl space-y-8">
            {project.cover_image && (
              <div
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1a202c] border border-white/[0.08] shadow-2xl"
                style={{ aspectRatio: '16 / 10' }}
              >
                <Image
                  src={project.cover_image}
                  alt={`${project.title} interface overview`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover object-center"
                />
              </div>
            )}

            {project.tech_tags && project.tech_tags.length > 0 && (
              <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Technologies &amp; Architecture
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech_tags.map((tag: string) => (
                    <span key={tag} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {caseStudySections.map(
                ({ title, content, step }) =>
                  content && (
                    <article
                      key={title}
                      className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6 sm:p-8"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/25 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {step}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {title}
                        </h2>
                      </div>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                        {content}
                      </p>
                    </article>
                  )
              )}
            </div>

            {project.screenshots && project.screenshots.length > 1 && (
              <section>
                <h2 className="text-lg font-bold text-white mb-5">Additional Screenshots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.screenshots.slice(1).map((src: string, i: number) => (
                    <div
                      key={i}
                      className="relative rounded-2xl overflow-hidden bg-[#1a202c] border border-white/[0.08]"
                      style={{ aspectRatio: '16 / 10' }}
                    >
                      <Image src={src} alt={`${project.title} screenshot ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>All Projects</span>
              </Link>

              <Link href="/contact" className="cta-button-primary text-sm">
                Discuss a Similar Project &rarr;
              </Link>
            </div>
          </div>
        </div>
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
