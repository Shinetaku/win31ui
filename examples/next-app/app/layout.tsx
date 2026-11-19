import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@win31ui/react/win31.css'
import '@win31ui/react/styles.css'

export const metadata: Metadata = {
  title: 'win31ui — Next.js SSR demo',
  description: 'Windows 3.1 React components rendered on the server.'
}

/**
 * `data-win31-theme` is set server-side so the first paint already uses the
 * theme — no flash of the default palette. Win31Provider keeps it in sync
 * client-side after hydration.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-win31-theme="light">
      <body>{children}</body>
    </html>
  )
}
