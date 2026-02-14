import type { Metadata } from 'next'
import { TRPCProvider } from '@/lib/trpc-client'
import './globals.css'

export const metadata: Metadata = {
  title: 'APIHub - Free API Collection & Tester',
  description: 'Discover, test, and compare free APIs with built-in testing, code snippets, and community reviews.',
  keywords: ['API', 'free APIs', 'API testing', 'developer tools', 'public APIs'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
