import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'YourName.dev — Software Developer & Tech Professional',
    template: '%s | YourName.dev',
  },
  description:
    'Software Developer, Data Analyst, and AI Automation specialist. Building technology that solves real problems.',
  keywords: ['software developer', 'portfolio', 'web development', 'data analysis', 'AI automation'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourname.dev',
    title: 'YourName.dev — Software Developer & Tech Professional',
    description: 'Building technology that solves real problems.',
    siteName: 'YourName.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YourName.dev',
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
    <html lang="en" className={inter.variable}>
      <body className="bg-[#101827] text-white antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #2563eb33',
            },
          }}
        />
      </body>
    </html>
  )
}
