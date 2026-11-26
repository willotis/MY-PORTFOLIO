'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink, ArrowDown } from 'lucide-react'
import { GithubIcon } from '@/components/icons/BrandIcons'
import { DEFAULT_PROJECTS } from '@/lib/constants'
import type { Project } from '@/lib/types'

interface FeaturedProjectsProps {
  projects?: Project[]
}

export default function FeaturedProjects({ projects = [] }: FeaturedProjectsProps) {
  const displayProjects = projects.length > 0 ? projects.slice(0, 4) : DEFAULT_PROJECTS

  return (
    <section
      id="featured-projects"
      className="bg-[#0d1017] py-14 sm:py-20 border-b border-white/[0.06]"
    >
      <div className="page-container">

        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#3b82f6] uppercase mb-2">
              Selected Work
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <span>View all projects</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {/* Balanced 2-Column Project Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {displayProjects.map((project) => (
            <article
              key={project.id || project.slug}
              className="group flex flex-col h-full bg-[#141822] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-200 shadow-lg shadow-black/25"
            >
              {/* Fixed-Aspect Image Presentation Container */}
              <Link
                href={`/projects/${project.slug}`}
                className="relative block w-full overflow-hidden bg-[#1a202c] border-b border-white/[0.06]"
                style={{ aspectRatio: '16 / 10' }}
                aria-label={`View ${project.title} case study`}
              >
                {project.cover_image && (
                  <Image
                    src={project.cover_image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
                {project.status && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0d1017]/85 backdrop-blur-sm border border-white/[0.12] text-slate-200">
                    {project.status}
                  </span>
                )}
              </Link>

              {/* Structured Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                {project.category && (
                  <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1.5">
                    {project.category}
                  </p>
                )}

                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {project.title}
                  </Link>
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {project.description}
                </p>

                {project.tech_tags && project.tech_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech_tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Action Row */}
                <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>View Project</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        aria-label={`${project.title} GitHub repository`}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        aria-label={`${project.title} live prototype`}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section Continuation Anchor */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-2.5 text-center">
          <Link
            href="#skills-overview"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#141822] hover:bg-[#191e2b] border border-white/[0.1] text-slate-300 hover:text-white transition-colors"
            aria-label="Scroll to technical capabilities"
          >
            <ArrowDown size={15} />
          </Link>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-400">
            <a href="/api/cv/download" download className="hover:text-white transition-colors">
              Download CV
            </a>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact me
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
