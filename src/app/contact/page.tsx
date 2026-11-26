import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/contact/ContactForm'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { DEFAULT_PROFILE } from '@/lib/constants'
import { Mail, Phone, MapPin, Briefcase, Zap, Users, MessageSquare } from 'lucide-react'
import { GithubIcon, LinkedinIcon, TwitterIcon, WhatsAppIcon } from '@/components/icons/BrandIcons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for software development roles, contract work, and technical collaborations.',
}

export default async function ContactPage() {
  let profile = DEFAULT_PROFILE
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.from('profiles').select('*').single()
      if (data) profile = data
    } catch {}
  }

  const availability = [
    { icon: <Briefcase size={15} aria-hidden="true" />, label: 'Open to Full-Time Roles', active: profile.availability_employment },
    { icon: <Zap size={15} aria-hidden="true" />,       label: 'Available for Contract / Freelance', active: profile.availability_freelance },
    { icon: <Users size={15} aria-hidden="true" />,     label: 'Open to Technical Collaboration', active: profile.availability_collaboration },
  ]

  const socials = [
    { icon: <GithubIcon className="w-4 h-4" />,   label: 'GitHub',      href: profile.github_url   },
    { icon: <LinkedinIcon className="w-4 h-4" />, label: 'LinkedIn',    href: profile.linkedin_url },
    { icon: <TwitterIcon className="w-4 h-4" />,  label: 'Twitter / X', href: profile.twitter_url  },
    ...(profile.whatsapp ? [{ icon: <WhatsAppIcon className="w-4 h-4" />, label: 'WhatsApp', href: `https://wa.me/${profile.whatsapp.replace(/\D/g, '')}` }] : []),
  ]

  return (
    <div className="min-h-screen bg-[#0d1017] text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="hero-navy-backdrop py-12 sm:py-16 border-b border-white/[0.06]">
          <div className="page-container">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-[#3b82f6] uppercase mb-3">
                Contact &amp; Hiring
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                Let&apos;s Work Together
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-7">
                Whether you are recruiting for a technical role, planning a new software product, or looking for an experienced collaborator, feel free to reach out.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {availability.filter((a) => a.active).map((a) => (
                  <div
                    key={a.label}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141822] border border-white/[0.1] text-xs sm:text-sm text-slate-200 font-medium"
                  >
                    <span className="text-blue-400">{a.icon}</span>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form & Contact Channels */}
        <section className="py-12 sm:py-16">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
              {/* Direct Form */}
              <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                    <MessageSquare size={16} aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Send Direct Message</h2>
                </div>
                <ContactForm />
              </div>

              {/* Channels */}
              <div className="space-y-6">
                <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                    Direct Channels
                  </h3>
                  <div className="space-y-4 text-sm">
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400 shrink-0">
                        <Mail size={15} aria-hidden="true" />
                      </div>
                      <span className="break-all">{profile.email}</span>
                    </a>

                    {profile.phone && (
                      <div className="flex items-center gap-3 text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400 shrink-0">
                          <Phone size={15} aria-hidden="true" />
                        </div>
                        <span>{profile.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400 shrink-0">
                        <MapPin size={15} aria-hidden="true" />
                      </div>
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                    Professional Profiles
                  </h3>
                  <div className="space-y-2">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] text-slate-300 hover:text-white transition-colors"
                      >
                        <span className="text-slate-400">{s.icon}</span>
                        <span className="text-sm font-medium">{s.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                    Prompt Response
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    I typically respond to inquiries within 24 to 48 hours on business days.
                  </p>
                </div>
              </div>
            </div>
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
