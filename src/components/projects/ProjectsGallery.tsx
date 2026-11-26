'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/icons/BrandIcons'
import type { Project } from '@/lib/types'

interface ProjectsGalleryProps {
  projects: Project[]
}

export default function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))]

  const filtered = projects.filter((p) => {
    const matchesSearch =
      query === '' ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tech_tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))

    const matchesCat = activeCategory === 'All' || p.category === activeCategory
    return matchesSearch && matchesCat
  })

  return (
    <div>
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-10">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search projects or technologies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, technologies..."
            className="form-input-field pl-10 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-600/30'
                  : 'bg-[#141822] text-slate-300 hover:text-white border border-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {query && (
        <p className="text-xs text-slate-400 mb-6">
          Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''} matching &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#141822] border border-white/[0.08] rounded-2xl">
          <p className="text-base font-semibold text-white mb-1">No matching projects found</p>
          <p className="text-xs text-slate-400 mb-5">Try clearing your search query or filters.</p>
          <button
            type="button"
            onClick={() => { setQuery(''); setActiveCategory('All') }}
            className="cta-button-secondary text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((project) => (
            <article
              key={project.id || project.slug}
              className="group bg-[#141822] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col h-full shadow-lg shadow-black/20"
            >
              {/* Fixed-Aspect Image Presentation */}
              <Link
                href={`/projects/${project.slug}`}
                className="relative block w-full overflow-hidden bg-[#1a202c] border-b border-white/[0.06]"
                style={{ aspectRatio: '16 / 10' }}
                aria-label={`Read ${project.title} case study`}
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
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0d1017]/85 backdrop-blur-sm border border-white/[0.12] text-slate-200">
                  {project.status}
                </span>
              </Link>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
                  {project.category}
                </p>
                <h2 className="text-xl font-bold text-white tracking-tight mb-2">
                  <Link href={`/projects/${project.slug}`} className="hover:text-blue-400 transition-colors">
                    {project.title}
                  </Link>
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                  {project.description}
                </p>

                {project.tech_tags && project.tech_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech_tags.map((tag) => (
                      <span key={tag} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight size={14} aria-hidden="true" />
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
      )}
    </div>
  )
}
