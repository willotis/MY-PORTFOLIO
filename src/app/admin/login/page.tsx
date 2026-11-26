'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const configured = isSupabaseConfigured()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!configured) {
      toast.error('Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local first.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back!')
      router.push('/admin')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-5"
        >
          <ArrowLeft size={14} />
          <span>Back to Portfolio</span>
        </Link>

        {/* Card */}
        <div className="bg-[#151821] rounded-2xl p-8 border border-white/[0.08] shadow-2xl">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#2563eb] text-white font-mono text-base font-bold shadow-lg shadow-blue-600/30 mb-4">
              &lt;/&gt;
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">Sign in to manage your portfolio</p>
          </div>

          {!configured && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-2.5 leading-relaxed">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300 mb-0.5">Supabase Not Connected</p>
                <p className="text-amber-200/80">
                  Add your Supabase URL &amp; anon key to <code className="text-white">.env.local</code> and create an admin user in Supabase Auth to sign in.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@willisotis.dev"
                required
                autoComplete="email"
                className="form-input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  className="form-input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cta-button-primary w-full justify-center mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Only authorized administrators can access this area.
          </p>
        </div>
      </div>
    </div>
  )
}
