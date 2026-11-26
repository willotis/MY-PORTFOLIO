'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Star, StarOff,
  Loader2, GripVertical, Upload, X, ImagePlus,
} from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/lib/types'
import { slugify } from '@/lib/utils'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141822] rounded-2xl p-6 border border-white/[0.08] space-y-4">
      <h2 className="font-semibold text-white text-sm">{title}</h2>
      {children}
    </div>
  )
}

export default function AdminProjectsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<Partial<Project> | null>(null)

  const refreshProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => {
      if (active) {
        setProjects(data ?? [])
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [supabase])

  const toggleField = async (id: string, field: 'published' | 'featured', value: boolean) => {
    const { error } = await supabase.from('projects').update({ [field]: !value }).eq('id', id)
    if (error) toast.error('Update failed')
    else {
      toast.success(`Project ${field === 'published' ? (!value ? 'published' : 'unpublished') : (!value ? 'featured' : 'unfeatured')}`)
      setProjects((ps) => ps.map((p) => p.id === id ? { ...p, [field]: !value } : p))
    }
  }

  const deleteProject = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) toast.error('Delete failed')
    else {
      toast.success('Project deleted')
      setProjects((ps) => ps.filter((p) => p.id !== id))
    }
  }

  const handleSave = async (data: Partial<Project>) => {
    const isNew = !data.id
    const slug = data.slug || slugify(data.title ?? '')
    const payload = { ...data, slug, updated_at: new Date().toISOString() }

    if (isNew) {
      const { error } = await supabase.from('projects').insert(payload)
      if (error) { toast.error(error.message); return }
    } else {
      const { error } = await supabase.from('projects').update(payload).eq('id', data.id)
      if (error) { toast.error(error.message); return }
    }
    toast.success(isNew ? 'Project created!' : 'Project updated!')
    setShowForm(false)
    setEditing(null)
    refreshProjects()
  }

  if (showForm || editing) {
    return (
      <ProjectForm
        initial={editing ?? {}}
        onSave={handleSave}
        onCancel={() => { setShowForm(false); setEditing(null) }}
      />
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[#93c5fd] uppercase mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="cta-button-primary text-sm"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-slate-400 py-12">
          <Loader2 size={18} className="animate-spin" />
          Loading projects…
        </div>
      )}

      {/* Empty */}
      {!loading && projects.length === 0 && (
        <div className="bg-[#141822] rounded-2xl border border-white/[0.08] py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center mx-auto mb-4">
            <ImagePlus size={22} className="text-blue-400" />
          </div>
          <p className="text-white font-semibold mb-1.5">No projects yet</p>
          <p className="text-sm text-slate-400 mb-6">Create your first project to get started.</p>
          <button onClick={() => setShowForm(true)} className="cta-button-primary text-sm">
            <Plus size={15} />
            Add First Project
          </button>
        </div>
      )}

      {/* Project list */}
      {!loading && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 bg-[#141822] rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <GripVertical size={16} className="text-slate-700 shrink-0 cursor-grab" />

              {/* Cover thumbnail */}
              {project.cover_image ? (
                <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-white/8">
                  <Image src={project.cover_image} alt={project.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-10 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center shrink-0">
                  <ImagePlus size={14} className="text-slate-600" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white text-sm truncate">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20">Featured</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${project.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/8'}`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-slate-500 text-xs truncate mt-0.5">{project.category} · {project.status}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => toggleField(project.id, 'featured', project.featured)}
                  title={project.featured ? 'Unfeature' : 'Feature on homepage'}
                  className="p-2 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-500/5 transition-colors"
                >
                  {project.featured ? <Star size={15} /> : <StarOff size={15} />}
                </button>
                <button
                  onClick={() => toggleField(project.id, 'published', project.published)}
                  title={project.published ? 'Unpublish' : 'Publish'}
                  className="p-2 rounded-lg text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors"
                >
                  {project.published ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => setEditing(project)}
                  title="Edit project"
                  className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/8 transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => deleteProject(project.id, project.title)}
                  title="Delete project"
                  className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT FORM — with cover image upload
───────────────────────────────────────────────────────────────────────────── */
function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<Project>
  onSave: (data: Partial<Project>) => Promise<void>
  onCancel: () => void
}) {
  const supabase = createClient()
  const coverRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<Partial<Project>>({
    title: '', description: '', category: 'Software Development',
    status: 'In Progress', tech_tags: [], published: false, featured: false,
    github_url: '', demo_url: '', problem: '', solution: '', role: '', journey: '',
    cover_image: '',
    ...initial,
  })
  const [saving,         setSaving]         = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [tagInput,       setTagInput]       = useState('')

  const set = (key: keyof Project, value: unknown) => setForm((f) => ({ ...f, [key]: value }))

  /* ── Cover image upload ── */
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10 MB'); return }

    setUploadingCover(true)
    try {
      const ext = file.name.split('.').pop()
      const filename = `project-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('projects')
        .upload(filename, file, { upsert: true })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('projects').getPublicUrl(filename)
      set('cover_image', publicUrl)
      toast.success('Cover image uploaded!')
    } catch {
      toast.error('Upload failed — ensure the "projects" storage bucket exists in Supabase.')
    } finally {
      setUploadingCover(false)
      if (coverRef.current) coverRef.current.value = ''
    }
  }

  /* ── Tags ── */
  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tech_tags?.includes(t)) set('tech_tags', [...(form.tech_tags ?? []), t])
    setTagInput('')
  }
  const removeTag = (tag: string) => set('tech_tags', (form.tech_tags ?? []).filter((t) => t !== tag))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  const inp = 'form-input-field text-sm'

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{initial.id ? 'Edit Project' : 'New Project'}</h1>
        </div>
      </div>

      {/* Cover Image */}
      <SectionCard title="Cover Image">
        <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
        {form.cover_image ? (
          <div className="relative">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/8">
              <Image src={form.cover_image} alt="Cover preview" fill className="object-cover" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                disabled={uploadingCover}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb]/10 border border-[#2563eb]/20 text-[#93c5fd] text-sm font-medium hover:bg-[#2563eb]/20 transition-colors"
              >
                {uploadingCover ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Replace Image
              </button>
              <button
                type="button"
                onClick={() => set('cover_image', '')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/15 transition-colors"
              >
                <X size={14} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverRef.current?.click()}
            disabled={uploadingCover}
            className="w-full flex flex-col items-center justify-center gap-3 aspect-[16/10] rounded-xl border-2 border-dashed border-white/10 hover:border-[#2563eb]/30 hover:bg-[#2563eb]/3 transition-all text-slate-500 hover:text-slate-300"
          >
            {uploadingCover ? (
              <Loader2 size={28} className="animate-spin text-[#93c5fd]" />
            ) : (
              <ImagePlus size={28} />
            )}
            <div className="text-center">
              <p className="text-sm font-medium">{uploadingCover ? 'Uploading…' : 'Upload cover image'}</p>
              <p className="text-xs text-slate-600 mt-0.5">JPG, PNG, WebP — max 10 MB</p>
            </div>
          </button>
        )}
      </SectionCard>

      {/* Basic Info */}
      <SectionCard title="Basic Info">
        <div>
          <label className="block text-xs text-slate-500 mb-2">Title *</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
            className={inp}
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-2">Slug (auto-generated)</label>
          <input
            value={form.slug || slugify(form.title ?? '')}
            onChange={(e) => set('slug', e.target.value)}
            className={inp}
            placeholder="project-slug"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Category</label>
            <input value={form.category} onChange={(e) => set('category', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inp}>
              {['In Progress','Working Prototype','Functional Prototype','Live','Completed','On Hold'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-2">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className={`${inp} resize-none`}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">GitHub URL</label>
            <input type="url" value={form.github_url} onChange={(e) => set('github_url', e.target.value)} className={inp} placeholder="https://github.com/…" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Live Demo URL</label>
            <input type="url" value={form.demo_url} onChange={(e) => set('demo_url', e.target.value)} className={inp} placeholder="https://…" />
          </div>
        </div>
      </SectionCard>

      {/* Tech Tags */}
      <SectionCard title="Technologies Used">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className={`${inp} flex-1`}
            placeholder="React, Node.js, Supabase… (press Enter)"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-3 bg-[#2563eb]/10 text-[#93c5fd] rounded-xl text-sm border border-[#2563eb]/20 hover:bg-[#2563eb]/20 transition-colors whitespace-nowrap"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.tech_tags ?? []).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563eb]/8 text-[#93c5fd] text-sm border border-[#2563eb]/15">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-slate-500 hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Case Study */}
      <SectionCard title="Case Study Details">
        {(['problem', 'solution', 'role', 'journey'] as const).map((key) => (
          <div key={key}>
            <label className="block text-xs text-slate-500 mb-2">
              {key === 'journey' ? 'Development Journey' : key === 'role' ? 'My Role & Contributions' : `The ${key.charAt(0).toUpperCase() + key.slice(1)}`}
            </label>
            <textarea
              value={(form[key] as string) ?? ''}
              onChange={(e) => set(key, e.target.value)}
              rows={4}
              className={`${inp} resize-none`}
              placeholder={`Describe the ${key}…`}
            />
          </div>
        ))}
      </SectionCard>

      {/* Visibility */}
      <SectionCard title="Visibility">
        <div className="flex gap-8">
          {([['published', 'Published (visible on site)'], ['featured', 'Featured on Homepage']] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set(key, !form[key])}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form[key] ? 'bg-[#2563eb]' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form[key] ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </SectionCard>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="cta-button-primary disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? 'Saving…' : initial.id ? 'Update Project' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cta-button-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
