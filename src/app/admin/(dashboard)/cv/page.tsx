'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { fetchLatestProfile } from '@/lib/supabase/profile'
import { toast } from 'sonner'
import { Upload, Download, Eye, EyeOff, FileText, Loader2, ExternalLink } from 'lucide-react'

export default function AdminCVPage() {
  const supabase = useMemo(() => createClient(), [])
  const [cvUrl, setCvUrl] = useState('')
  const [cvVisible, setCvVisible] = useState(true)
  const [profileId, setProfileId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    fetchLatestProfile(supabase).then(({ data }) => {
      if (active) {
        if (data) {
          setCvUrl(data.cv_url ?? '')
          setCvVisible(data.cv_visible ?? true)
          setProfileId(data.id)
        }
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [supabase])

  const resolveProfileId = async () => {
    if (profileId) return profileId
    const { data } = await fetchLatestProfile(supabase)
    if (data?.id) {
      setProfileId(data.id)
      return data.id
    }
    return ''
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF document')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error('CV file must be under 15MB')
      return
    }
    setUploading(true)
    try {
      const targetId = await resolveProfileId()
      if (!targetId) throw new Error('No profile record found in Supabase.')
      const filename = `cv-${Date.now()}.pdf`
      const { error: uploadError } = await supabase.storage.from('cv').upload(filename, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('cv').getPublicUrl(filename)
      const { error: dbError } = await supabase.from('profiles').update({ cv_url: publicUrl, updated_at: new Date().toISOString() }).eq('id', targetId)
      if (dbError) throw dbError
      setCvUrl(publicUrl)
      toast.success('CV uploaded successfully!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed. Ensure the "cv" storage bucket exists in Supabase.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleVisibilityToggle = async () => {
    setSaving(true)
    const targetId = await resolveProfileId()
    if (!targetId) {
      toast.error('No profile record found in Supabase.')
      setSaving(false)
      return
    }
    const newVal = !cvVisible
    const { error } = await supabase.from('profiles').update({ cv_visible: newVal, updated_at: new Date().toISOString() }).eq('id', targetId)
    if (error) {
      toast.error('Update failed')
      setSaving(false)
      return
    }
    setCvVisible(newVal)
    toast.success(newVal ? 'CV is now visible on public site' : 'CV is now hidden from public site')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 text-slate-400 flex items-center gap-3">
        <Loader2 size={18} className="animate-spin" />
        <span>Loading CV settings...</span>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
          Career Documents
        </p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Curriculum Vitae</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Upload and manage your CV / résumé PDF for recruiters and collaborators.
        </p>
      </div>

      {/* Upload card */}
      <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Upload or Replace CV
        </h2>
        <input ref={fileRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-colors mb-4 bg-white/[0.02]"
        >
          <FileText size={36} className="mx-auto mb-3 text-blue-400/60" />
          <p className="text-white font-medium mb-1">Click to browse or drop your CV PDF</p>
          <p className="text-slate-500 text-xs">Standard PDF format up to 15MB</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="cta-button-primary text-xs sm:text-sm py-2 px-5"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span>{uploading ? 'Uploading...' : cvUrl ? 'Replace Existing CV' : 'Upload CV'}</span>
        </button>
      </div>

      {/* Active CV preview card */}
      {cvUrl && (
        <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Active CV Document
          </h2>
          <div className="flex items-center gap-4 p-4 bg-[#0d0f15] rounded-xl border border-white/[0.08] mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">Curriculum Vitae (PDF)</p>
              <p className="text-slate-500 text-xs truncate">{cvUrl}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button-secondary text-xs sm:text-sm py-2 px-4"
            >
              <ExternalLink size={14} />
              <span>Preview</span>
            </a>
            <a
              href={cvUrl}
              download
              className="cta-button-secondary text-xs sm:text-sm py-2 px-4"
            >
              <Download size={14} />
              <span>Download</span>
            </a>
          </div>
        </div>
      )}

      {/* Visibility Toggle */}
      <div className="bg-[#151821] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Public Visibility
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Show CV on public site</p>
            <p className="text-slate-400 text-xs mt-0.5">
              Allows visitors to click &quot;Download CV&quot; in the hero and footer sections.
            </p>
          </div>
          <button
            onClick={handleVisibilityToggle}
            disabled={saving}
            className={`w-12 h-7 rounded-full transition-colors relative ${cvVisible ? 'bg-[#2563eb]' : 'bg-white/10'
              } disabled:opacity-60`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${cvVisible ? 'translate-x-5' : ''
                }`}
            />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {cvVisible ? <Eye size={15} className="text-emerald-400" /> : <EyeOff size={15} className="text-slate-500" />}
          <span className={`text-xs font-medium ${cvVisible ? 'text-emerald-400' : 'text-slate-500'}`}>
            {cvVisible ? 'CV download button is visible publicly' : 'CV download button is hidden publicly'}
          </span>
        </div>
      </div>
    </div>
  )
}
