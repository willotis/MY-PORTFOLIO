'use client'

import Link from 'next/link'
import { FolderOpen, User, MessageSquare, FileText, Image as ImageIcon, ArrowRight } from 'lucide-react'

const quickLinks = [
  {
    href: '/admin/profile',
    icon: User,
    title: 'Edit Profile & Portrait',
    desc: 'Update your name, bio, portrait photo, and social profiles',
    color: 'text-blue-400',
  },
  {
    href: '/admin/projects',
    icon: FolderOpen,
    title: 'Manage Projects',
    desc: 'Add new work, upload cover images, and publish case studies',
    color: 'text-emerald-400',
  },
  {
    href: '/admin/media',
    icon: ImageIcon,
    title: 'Media Library',
    desc: 'Upload demonstration videos, architecture diagrams, and captures',
    color: 'text-cyan-400',
  },
  {
    href: '/admin/cv',
    icon: FileText,
    title: 'Curriculum Vitae',
    desc: 'Upload or replace your CV / résumé PDF and toggle visibility',
    color: 'text-purple-400',
  },
  {
    href: '/admin/messages',
    icon: MessageSquare,
    title: 'Incoming Inquiries',
    desc: 'Review and manage messages sent through the public contact form',
    color: 'text-amber-400',
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="p-6 sm:p-8 max-w-4xl space-y-8">
      {/* Welcome */}
      <div>
        <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
          Management Portal
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Manage your portfolio content, projects, and media. Changes persist to Supabase and reflect on your public site.
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map(({ href, icon: Icon, title, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="group bg-[#151821] border border-white/[0.08] hover:border-blue-500/30 rounded-2xl p-5 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                <Icon size={19} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">
                  {title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
              <ArrowRight
                size={15}
                className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Tip Banner */}
      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] text-xs text-slate-400 flex items-center justify-between gap-4">
        <div>
          <span className="text-blue-400 font-semibold">Pro-tip:</span> You can upload a high-resolution photo of yourself in the{' '}
          <Link href="/admin/profile" className="text-white hover:underline font-medium">
            Profile Editor
          </Link>{' '}
          to immediately replace the placeholder portrait on the homepage.
        </div>
        <Link href="/" target="_blank" className="text-blue-400 hover:text-blue-300 font-semibold shrink-0 text-xs">
          View Live Site &rarr;
        </Link>
      </div>
    </div>
  )
}
