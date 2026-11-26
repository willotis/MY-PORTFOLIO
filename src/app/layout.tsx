import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'Willis Otis — Software Developer & Tech Professional',
    template: '%s | Willis Otis',
  },
  description:
    'Willis Otis — Software Developer, Data Analyst, and AI Automation specialist. Building technology that solves real problems.',
  keywords: ['Willis Otis', 'software developer', 'portfolio', 'web development', 'data analysis', 'AI automation'],
  authors: [{ name: 'Willis Otis' }],
  creator: 'Willis Otis',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://willisotis.dev',
    title: 'Willis Otis — Software Developer & Tech Professional',
    description: 'Building technology that solves real problems.',
    siteName: 'Willis Otis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Willis Otis',
    description: 'Building technology that solves real problems.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0d1017] text-white antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#151821',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
