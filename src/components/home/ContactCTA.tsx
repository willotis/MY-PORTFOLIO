'use client'

import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle2, Download } from 'lucide-react'

interface ContactCTAProps {
  email?: string
  availability?: {
    employment?: boolean
    freelance?: boolean
    collaboration?: boolean
  }
}

export default function ContactCTA({
  email = 'hello@willisotis.dev',
  availability = { employment: true, freelance: true, collaboration: true },
}: ContactCTAProps) {
  const options = [
    { label: 'Full-Time Roles', active: availability.employment },
    { label: 'Contract & Freelance', active: availability.freelance },
    { label: 'Collaboration', active: availability.collaboration },
  ]

  return (
    <section className="bg-[#0d1017] py-14 sm:py-16">
      <div className="page-container">
        <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">

          {/* Left: Closing Summary & Availability */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>Available for Opportunities</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              Interested in working together?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
              Open to software engineering positions, technical consulting, and collaborative builds.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {options.map((opt) =>
                opt.active ? (
                  <span
                    key={opt.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200"
                  >
                    <CheckCircle2 size={13} className="text-blue-400 shrink-0" aria-hidden="true" />
                    {opt.label}
                  </span>
                ) : null
              )}
            </div>
          </div>

          {/* Right: Direct Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <Link href="/contact" className="cta-button-primary">
              <span>Start a Conversation</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <Mail size={15} className="text-blue-400" aria-hidden="true" />
                <span>{email}</span>
              </a>
              <a
                href="/api/cv/download"
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <Download size={14} aria-hidden="true" />
                <span>CV</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
