'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, Loader2, Upload, User } from 'lucide-react'
import type { Profile } from '@/lib/types'

export default function AdminProfilePage() {
  const supabase = useMemo(() => createClient(), [])
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('profiles').select('*').single().then(({ data }) => {
      if (data) setProfile(data)
      setLoading(false)
    })
  }, [supabase])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Please upload a JPG, PNG, WebP, or GIF image')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image must be under 8MB')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filename = `avatar-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filename, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filename)
      setProfile((p) => ({ ...p, avatar_url: publicUrl }))
      toast.success('Profile photo uploaded!')
    } catch {
      toast.error('Upload failed. Ensure the "avatars" storage bucket exists in Supabase.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to save profile changes')
    } finally {
      setSaving(false)
    }
  }

  const field = (key: keyof Profile, label: string, type = 'text', multiline = false) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={(profile[key] as string) ?? ''}
          onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
          rows={4}
          className="form-input-field resize-none text-sm"
        />
      ) : (
        <input
          type={type}
          value={(profile[key] as string) ?? ''}
          onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
          className="form-input-field text-sm"
        />
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="p-8 text-slate-400 flex items-center gap-3">
        <Loader2 size={18} className="animate-spin" />
        <span>Loading profile data...</span>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
          Identity &amp; Branding
        </p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Editor</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Update the profile details displayed on the public portfolio.
        </p>
      </div>

      {/* Avatar Card */}
      <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Professional Portrait
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-[#080e1e] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 relative">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-slate-600" />
            )}
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="cta-button-primary text-xs sm:text-sm py-2 px-4"
              >
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                <span>{uploading ? 'Uploading...' : 'Upload New Photo'}</span>
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              JPG, PNG, or WebP. Optimal aspect ratio: 3:4.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          Basic Information
        </h2>
        {field('name', 'Full Name')}
        {field('title', 'Professional Title')}
        {field('tagline', 'Hero Headline Tagline')}
        {field('bio', 'Professional Biography', 'text', true)}
        {field('location', 'Geographic Location')}
      </div>

      {/* Contact Details */}
      <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          Contact Details
        </h2>
        {field('email', 'Email Address', 'email')}
        {field('phone', 'Phone Number')}
        {field('whatsapp', 'WhatsApp Direct Number')}
      </div>

      {/* Social Links */}
      <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          Social Profiles
        </h2>
        {field('linkedin_url', 'LinkedIn URL', 'url')}
        {field('github_url', 'GitHub URL', 'url')}
        {field('twitter_url', 'Twitter / X URL', 'url')}
        {field('website_url', 'Website URL', 'url')}
      </div>

      {/* Availability Controls */}
      <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Availability Status
        </h2>
        <div className="space-y-3">
          {([
            ['availability_employment', 'Open to Full-Time Employment'],
            ['availability_freelance', 'Available for Contract / Freelance'],
            ['availability_collaboration', 'Open to Technical Collaborations'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setProfile((p) => ({ ...p, [key]: !p[key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  profile[key] ? 'bg-[#2563eb]' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    profile[key] ? 'translate-x-5' : ''
                  }`}
                />
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="cta-button-primary w-full sm:w-auto"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </div>
    </div>
  )
}
