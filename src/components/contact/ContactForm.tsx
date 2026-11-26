'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to send')
      toast.success("Message sent! I'll get back to you soon.")
      reset()
    } catch {
      toast.error('Something went wrong. Please try again or email me directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Your Name *
          </label>
          <input
            id="contact-name"
            {...register('name')}
            placeholder="Jane Smith"
            aria-invalid={Boolean(errors.name)}
            className="form-input-field"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Email Address *
          </label>
          <input
            id="contact-email"
            {...register('email')}
            type="email"
            placeholder="jane@company.com"
            aria-invalid={Boolean(errors.email)}
            className="form-input-field"
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Subject / Topic *
        </label>
        <input
          id="contact-subject"
          {...register('subject')}
          placeholder="Job opportunity / Project collaboration / Consultation"
          aria-invalid={Boolean(errors.subject)}
          className="form-input-field"
        />
        {errors.subject && <p className="mt-1.5 text-xs text-red-400">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Message *
        </label>
        <textarea
          id="contact-message"
          {...register('message')}
          rows={5}
          placeholder="Tell me about your project, timeline, or opportunity..."
          aria-invalid={Boolean(errors.message)}
          className="form-input-field resize-none"
        />
        {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="cta-button-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  )
}
