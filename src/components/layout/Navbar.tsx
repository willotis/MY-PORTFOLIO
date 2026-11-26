'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Media',    href: '/media' },
  { label: 'Contact',  href: '/contact' },
]

interface NavbarProps {
  brandName?: string
}

export default function Navbar({ brandName = 'Willis Otis' }: NavbarProps) {
  const pathname = usePathname()
  const [openForPath, setOpenForPath] = useState<string | null>(null)
  const menuOpen = openForPath === pathname

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenForPath(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#091229]/95 backdrop-blur-md border-b border-white/[0.07]"
      style={{ height: 'var(--navbar-height)' }}
    >
      <nav
        aria-label="Primary Navigation"
        className="page-container h-full flex items-center justify-between gap-6"
      >
        {/* Brand Monogram + Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label={`${brandName} homepage`}
        >
          <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#2563eb] text-white font-mono text-xs font-bold tracking-tight shadow-sm shadow-blue-600/30 group-hover:bg-[#1d4ed8] transition-colors">
            &lt;/&gt;
          </span>
          <span className="text-[15px] font-bold text-white tracking-tight">
            {brandName}
          </span>
        </Link>

        {/* Desktop Links — single horizontal axis */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(({ label, href }) => {
            const active = href === '/'
              ? pathname === '/'
              : pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-white bg-white/[0.08]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold shadow-sm shadow-blue-600/25 transition-colors"
          >
            Hire Me
          </Link>

          <button
            type="button"
            onClick={() => setOpenForPath((prev) => (prev === pathname ? null : pathname))}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.07] border border-white/[0.08] transition-colors"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden absolute top-[72px] inset-x-0 bg-[#0d1322] border-b border-white/[0.1] shadow-2xl"
        >
          <div className="page-container py-4 flex flex-col gap-1.5">
            {navLinks.map(({ label, href }) => {
              const active = href === '/'
                ? pathname === '/'
                : pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpenForPath(null)}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-600/15 text-white border border-blue-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
            <div className="h-px bg-white/[0.08] my-2" />
            <Link
              href="/contact"
              onClick={() => setOpenForPath(null)}
              className="cta-button-primary w-full text-sm py-2.5"
            >
              Hire Me
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpenForPath(null)}
              className="px-3.5 py-2 text-center text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              Admin Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
