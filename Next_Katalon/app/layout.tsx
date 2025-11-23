import type { Metadata } from 'next'
import BootstrapClient from '@/components/BootstrapClient'
import './globals.css'

export const metadata: Metadata = {
  title: 'Katalon Studio Project Analyzer',
  description: 'Analyze and visualize your Katalon Studio automation projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  )
}

