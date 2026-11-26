import Link from 'next/link'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/icons/BrandIcons'

interface FooterProps {
  name?: string
  email?: string
  github?: string
  linkedin?: string
  twitter?: string
}

export default function Footer({
  name = 'Willis Otis',
  email = 'hello@willisotis.dev',
  github = 'https://github.com',
  linkedin = 'https://linkedin.com',
  twitter = 'https://twitter.com',
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#080a0f] border-t border-white/[0.08]">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-10">

          {/* Brand Summary */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group" aria-label={`${name} homepage`}>
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#2563eb] text-white font-mono text-xs font-bold tracking-tight">
                &lt;/&gt;
              </span>
              <span className="text-[15px] font-bold text-white tracking-tight">
                {name}
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-5">
              Software development, data analysis, and intelligent automation. Building dependable digital solutions for practical problems.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="X / Twitter Profile"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-slate-400 hover:text-white transition-colors">
                  Media
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Admin */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-4">
              Direct Access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/api/cv/download" download className="text-slate-400 hover:text-white transition-colors">
                  Download CV (PDF)
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="text-slate-400 hover:text-white transition-colors break-all">
                  {email}
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Admin Dashboard &rarr;
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {year} {name}. All rights reserved.</p>
          <p>Built with Next.js, TypeScript &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  )
}
