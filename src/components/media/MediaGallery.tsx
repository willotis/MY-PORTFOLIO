'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Play, Image as ImageIcon, Video, Grid3X3 } from 'lucide-react'
import type { Media } from '@/lib/types'

export default function MediaGallery({ media }: { media: Media[] }) {
  const [lightbox, setLightbox] = useState<Media | null>(null)
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filtered = media.filter((m) => filter === 'all' || m.type === filter)

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-[#141822] border border-white/[0.08] rounded-2xl px-6">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
          <Grid3X3 size={24} className="text-slate-400" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-white mb-1.5">No media items published yet</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Upload screenshots, demonstrations, and video captures through the{' '}
          <a href="/admin/media" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            admin media manager
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter media type">
        {(['all', 'image', 'video'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#141822] text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            {f === 'image' && <ImageIcon size={14} aria-hidden="true" />}
            {f === 'video' && <Video size={14} aria-hidden="true" />}
            <span>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === f ? 'bg-white/20' : 'bg-white/[0.06]'}`}>
              {f === 'all' ? media.length : media.filter((m) => m.type === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(item)}
            className="group relative text-left rounded-2xl overflow-hidden bg-[#141822] border border-white/[0.08] hover:border-blue-500/40 transition-colors cursor-pointer"
            style={{ aspectRatio: '4 / 3' }}
          >
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={item.caption || 'Project media item'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0d1017]">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Play size={20} className="text-blue-400 ml-0.5" />
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              {item.caption && (
                <p className="text-white text-xs font-medium truncate">{item.caption}</p>
              )}
              <p className="text-slate-300 text-[11px]">Click to view</p>
            </div>
          </button>
        ))}
      </div>

      {/* Accessible Lightbox Modal */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption || 'Media preview'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-xl bg-[#141822] border border-white/[0.14] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X size={18} />
            </button>

            {lightbox.type === 'image' ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0d1017]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightbox.url}
                  alt={lightbox.caption || 'Preview'}
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
              </div>
            ) : (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="w-full rounded-2xl border border-white/[0.12]"
              />
            )}

            {lightbox.caption && (
              <p className="mt-4 text-center text-sm text-slate-300">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
