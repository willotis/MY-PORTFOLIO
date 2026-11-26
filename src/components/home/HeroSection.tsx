'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Download } from 'lucide-react'

interface HeroSectionProps {
  portraitUrl?: string
  name?: string
  title?: string
  headline?: string
  tagline?: string
  bio?: string
  cvVisible?: boolean
  available?: boolean
}

export default function HeroSection({
  portraitUrl = '/images/portrait.png',
  name = 'Willis Otis',
  title = 'Software Developer & Tech Professional',
  headline = 'Building technology that solves real problems.',
  tagline = 'Software Development · Data Analysis · AI Automation',
  bio = 'I design and build dependable digital products — spanning full-stack web engineering, data analysis, and practical AI workflow automation.',
  cvVisible = true,
  available = true,
}: HeroSectionProps) {
  return (
    <section className="hero-navy-backdrop py-12 sm:py-16 lg:py-20 border-b border-white/[0.06]">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-10 lg:gap-14 items-center">

          {/* Left Column: Identity, Headline, Disciplines, Actions */}
          <div className="min-w-0 max-w-2xl">
            {/* Eyebrow & Availability */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-semibold tracking-[0.14em] text-[#3b82f6] uppercase">
                {name} · Tech Professional
              </span>
              {available && (
                <>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    Available for opportunities
                  </span>
                </>
              )}
            </div>

            {/* Primary Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white tracking-tight leading-[1.15] max-w-[18ch] mb-4">
              {headline}
            </h1>

            {/* Disciplines */}
            <p className="text-sm sm:text-base font-medium text-blue-200/90 tracking-wide mb-3">
              {tagline}
            </p>

            {/* Concise Introduction */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mb-7">
              {bio}
            </p>

            {/* Primary, Secondary, and CV Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="#featured-projects" className="cta-button-primary">
                <span>Explore My Work</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>

              <Link href="/contact" className="cta-button-secondary">
                Let&apos;s Work Together
              </Link>

              {cvVisible && (
                <a
                  href="/api/cv/download"
                  download
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <Download size={15} aria-hidden="true" />
                  <span>Download CV</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Portrait Frame */}
          <div className="flex justify-start md:justify-end">
            <div className="w-[180px] sm:w-[210px] md:w-full max-w-[260px]">
              <div
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.14] shadow-2xl shadow-black/50 bg-[#0e7490]"
                style={{ aspectRatio: '133 / 176' }}
              >
                <Image
                  src={portraitUrl}
                  alt={`${name} — ${title}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 180px, (max-width: 768px) 210px, 260px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
