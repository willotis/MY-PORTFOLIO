'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, User, FolderOpen, Image as ImageIcon,
  FileText, MessageSquare, LogOut, ExternalLink,
  ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/profile',  icon: User,            label: 'Profile'   },
  { href: '/admin/projects', icon: FolderOpen,      label: 'Projects'  },
  { href: '/admin/media',    icon: ImageIcon,       label: 'Media'     },
  { href: '/admin/cv',       icon: FileText,        label: 'CV'        },
  { href: '/admin/messages', icon: MessageSquare,   label: 'Messages'  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpenForPath, setMobileOpenForPath] = useState<string | null>(null)
  const mobileOpen = mobileOpenForPath === pathname

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile Admin Top Bar */}
      <div className="md:hidden sticky top-0 z-40 h-14 bg-[#091229] border-b border-white/[0.08] px-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-[#2563eb] text-white font-mono text-xs font-bold">
            &lt;/&gt;
          </span>
          <span className="text-sm font-semibold text-white">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpenForPath((prev) => (prev === pathname ? null : pathname))}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06]"
          aria-label={mobileOpen ? 'Close admin menu' : 'Open admin menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 bg-[#0d1322] border-b border-white/[0.1] p-4 shadow-2xl space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  active
                    ? 'bg-blue-600/15 text-white border border-blue-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                <Icon size={17} className={active ? 'text-blue-400' : 'text-current'} />
                <span>{label}</span>
              </Link>
            )
          })}
          <div className="h-px bg-white/[0.08] my-2" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white"
          >
            <ExternalLink size={17} />
            <span>View Live Site</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex shrink-0 h-screen sticky top-0 flex-col bg-[#091229] border-r border-white/[0.08] transition-all duration-200',
          collapsed ? 'w-[64px]' : 'w-[220px]'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-white/[0.08]">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center px-2 py-0.5 rounded-md bg-[#2563eb] text-white font-mono text-xs font-bold shrink-0">
                &lt;/&gt;
              </div>
              <span className="text-sm font-semibold text-white leading-tight">
                Willis Otis
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="flex items-center justify-center px-2 py-0.5 rounded-md bg-[#2563eb] text-white font-mono text-xs font-bold mx-auto">
              &lt;/&gt;
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0',
              collapsed && 'hidden'
            )}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={15} />
          </button>
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mt-2 mx-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={15} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto" aria-label="Admin Navigation">
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.12em] text-slate-500 uppercase">
              Manage
            </p>
          )}
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#2563eb]/15 text-white border border-[#2563eb]/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon
                  size={17}
                  className={cn('shrink-0', active ? 'text-blue-400' : 'text-current')}
                />
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/[0.08] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? 'View Site' : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors',
              collapsed && 'justify-center px-0'
            )}
          >
            <ExternalLink size={17} className="shrink-0" />
            {!collapsed && <span>View Site</span>}
          </a>
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors',
              collapsed && 'justify-center px-0'
            )}
          >
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
