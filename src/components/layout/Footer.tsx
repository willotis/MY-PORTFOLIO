import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-blue-900/20 bg-[#0d1521]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center font-bold text-white text-sm">
                YN
              </div>
              <span className="font-semibold text-white">
                YourName<span className="text-[#2563eb]">.dev</span>
              </span>
            </Link>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Software Developer · Data Analyst · AI Automation specialist.
              Building technology that solves real problems.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/projects', label: 'Projects' },
                { href: '/media', label: 'Media' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex gap-3">
              {[
                { href: 'https://github.com', icon: Github, label: 'GitHub' },
                { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
                { href: 'mailto:hello@yourname.dev', icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#2563eb] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#9ca3af] text-sm">
            &copy; {year} YourName. All rights reserved.
          </p>
          <p className="text-[#9ca3af] text-xs">
            Built with Next.js, Supabase &amp; ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}
