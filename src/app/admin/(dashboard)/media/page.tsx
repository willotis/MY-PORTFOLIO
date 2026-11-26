'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, Trash2, Loader2, Image as ImageIcon, Play } from 'lucide-react'
import Image from 'next/image'
import type { Media } from '@/lib/types'

export default function AdminMediaPage() {
  const supabase = useMemo(() => createClient(), [])
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const refreshMedia = async () => {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false })
    setMedia(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    supabase.from('media').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (active) {
        setMedia(data ?? [])
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [supabase])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      try {
        const isVideo = file.type.startsWith('video/')
        const bucket = 'media'
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const { error: uploadError } = await supabase.storage.from(bucket).upload(filename, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename)
        const { error: dbError } = await supabase.from('media').insert({
          url: publicUrl,
          type: isVideo ? 'video' : 'image',
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        })
        if (dbError) throw dbError
        toast.success(`Uploaded ${file.name}`)
      } catch {
        toast.error(`Failed to upload ${file.name}. Ensure "media" bucket exists in Supabase.`)
      }
    }
    setUploading(false)
    refreshMedia()
    if (fileRef.current) fileRef.current.value = ''
  }

  const deleteMedia = async (item: Media) => {
    if (!confirm('Delete this media file?')) return
    const filename = item.url.split('/').pop()
    if (filename) await supabase.storage.from('media').remove([filename])
    await supabase.from('media').delete().eq('id', item.id)
    toast.success('Media removed')
    setMedia((m) => m.filter((x) => x.id !== item.id))
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
            Visual Assets
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media Library</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Upload screenshots, walkthrough videos, and diagrams for the public gallery.
          </p>
        </div>

        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="cta-button-primary text-xs sm:text-sm py-2 px-4"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{uploading ? 'Uploading...' : 'Upload Media Files'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 py-12">
          <Loader2 size={18} className="animate-spin" />
          <span>Loading media assets...</span>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 bg-[#151821] border border-white/[0.08] rounded-2xl">
          <ImageIcon size={36} className="mx-auto mb-3 text-slate-600" />
          <p className="text-white font-medium mb-1">No media uploaded yet</p>
          <p className="text-xs text-slate-400 mb-5">
            Add images or video captures to showcase your engineering process.
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            className="cta-button-primary text-xs"
          >
            Upload First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#151821] border border-white/[0.08]"
            >
              {item.type === 'image' ? (
                <Image src={item.url} alt={item.caption || ''} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0d0f15]">
                  <Play size={28} className="text-blue-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                <p className="text-white text-xs truncate">{item.caption}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteMedia(item)}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                    title="Delete media"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
