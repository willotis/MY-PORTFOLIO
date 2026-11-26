'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, Archive, Trash2, Loader2, MessageSquare, ChevronDown } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Message } from '@/lib/types'

export default function AdminMessagesPage() {
  const supabase = useMemo(() => createClient(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const query = supabase.from('messages').select('*').order('created_at', { ascending: false })
    if (filter === 'unread') query.eq('read', false).eq('archived', false)
    else if (filter === 'archived') query.eq('archived', true)
    else query.eq('archived', false)
    query.then(({ data }) => {
      if (active) {
        setMessages(data ?? [])
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [filter, supabase])

  const markRead = async (id: string) => {
    await supabase.from('messages').update({ read: true }).eq('id', id)
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)))
  }

  const archive = async (id: string) => {
    await supabase.from('messages').update({ archived: true, read: true }).eq('id', id)
    toast.success('Message archived')
    setMessages((m) => m.filter((msg) => msg.id !== id))
  }

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return
    await supabase.from('messages').delete().eq('id', id)
    toast.success('Message deleted')
    setMessages((m) => m.filter((msg) => msg.id !== id))
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="p-6 sm:p-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
            Communications
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Incoming Inquiries</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setLoading(true); setFilter(f) }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              filter === f
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
                : 'bg-[#151821] text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 py-12">
          <Loader2 size={18} className="animate-spin" />
          <span>Loading messages...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 bg-[#151821] border border-white/[0.08] rounded-2xl">
          <MessageSquare size={36} className="mx-auto mb-3 text-slate-600" />
          <p className="text-white font-medium mb-1">No messages found</p>
          <p className="text-xs text-slate-400">
            {filter === 'unread'
              ? 'All messages have been reviewed.'
              : filter === 'archived'
              ? 'No messages in the archive.'
              : 'Your inbox is currently clear.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-[#151821] rounded-2xl border transition-all ${
                !msg.read ? 'border-blue-500/40 shadow-md shadow-blue-950/30' : 'border-white/[0.08]'
              }`}
            >
              {/* Message Header Item */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id)
                  if (!msg.read) markRead(msg.id)
                }}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    !msg.read
                      ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
                      : 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
                  }`}
                >
                  <Mail size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm truncate">{msg.name}</p>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />}
                  </div>
                  <p className="text-slate-400 text-xs truncate mt-0.5">
                    {msg.subject || '(No subject)'} · {msg.email}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-slate-500 text-xs hidden sm:block">
                    {formatDate(msg.created_at)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      expanded === msg.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Message Body */}
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap mb-5 bg-[#0d0f15] p-4 rounded-xl border border-white/[0.06]">
                    {msg.message}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your inquiry'}`}
                      className="cta-button-primary text-xs py-2 px-3.5"
                    >
                      <Mail size={13} />
                      <span>Reply via Email</span>
                    </a>
                    <button
                      onClick={() => archive(msg.id)}
                      className="cta-button-secondary text-xs py-2 px-3.5"
                    >
                      <Archive size={13} />
                      <span>Archive</span>
                    </button>
                    <button
                      onClick={() => deleteMsg(msg.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
